import { QueueManager } from './QueueManager';

function* statusesExpected(resultStatus: string): Generator<string> {
  yield 'executing';
  yield resultStatus;
}

function wrapPromiseWithSignal(
  promise: Promise<string>,
  signal?: AbortSignal
): Promise<string> {
  return new Promise((resolve, reject) => {
    promise.then((result) => {
      resolve(result);
    });

    signal?.addEventListener('abort', (e) => {
      // @ts-ignore
      if (e?.target?.reason !== 'timeout') {
        reject(new DOMException('canceled', 'AbortError'));
      }
    });
  });
}

const getPromise = (
  cid: string,
  timeout = 500,
  signal?: AbortSignal
): Promise<string> =>
  wrapPromiseWithSignal(
    new Promise<string>((resolve) => {
      setTimeout(() => resolve(`result ${cid}`), timeout);
    }),
    signal
  );

describe('QueueManager', () => {
  const maxConcurrentExecutions = 2;
  const timeout = 333;
  let queueManager: QueueManager<string>;

  beforeEach(() => {
    queueManager = new QueueManager<string>(maxConcurrentExecutions, timeout);
  });

  it('should keep in pending items thats is out of maxConcurrentExecutions', () => {
    queueManager.enqueue('1', () => Promise.resolve('42'), jest.fn);
    queueManager.enqueue('2', () => Promise.resolve('42'), jest.fn);
    queueManager.enqueue('3', () => Promise.resolve('42'), jest.fn);
    expect(queueManager.getQueue().pop()?.status).toEqual('pending');
  });

  it('should handle timeout', (done) => {
    const statuses = statusesExpected('timeout');
    const controller = new AbortController();
    const itemId = 'xxx';

    queueManager.enqueue(
      itemId,
      () => getPromise('result', 50000, controller.signal),
      (cid, status) => {
        expect(cid).toBe(itemId);
        expect(status).toBe(statuses.next().value);
      },
      controller
    );

    setTimeout(() => {
      const queue = queueManager.getQueue();
      expect(queue.length).toBe(0);
      done();
    }, 500);
  });

  it('should cancel queue items', (done) => {
    const statuses = statusesExpected('cancelled');

    const controller = new AbortController();
    const itemId = '1';

    queueManager.enqueue(
      itemId,
      () =>
        wrapPromiseWithSignal(getPromise('result', 50000), controller.signal),
      (cid, status) => {
        expect(cid).toBe(itemId);
        expect(status).toBe(statuses.next().value);
      },
      controller
    );
    queueManager.cancel(itemId);
    setTimeout(() => {
      expect(queueManager.getQueue().length).toEqual(0);
      done();
    }, 500);
  });
  it('should handle execution errors', () => {
    const statuses = statusesExpected('error');
    const itemId = '1';
    const promise = new Promise<string>((resolve, reject) => {
      reject(new Error('some error'));
    });

    queueManager.enqueue(
      itemId,
      () => promise,
      (cid, status): void => {
        expect(cid).toBe(itemId);
        expect(status).toBe(statuses.next().value);
      }
    );
    setTimeout(() => {
      const queue = queueManager.getQueue();
      expect(queue.length).toBe(0);
    }, 0);
  });

  it('should execute queue items in order', () => {
    queueManager.enqueue(
      '1',
      () => getPromise('1'),
      (cid, status, result) => {
        expect(cid).toBe('1');
        expect(status).toBe('executing');
        expect(result).toBeUndefined();
      }
    );

    queueManager.enqueue(
      '2',
      () => getPromise('2'),
      (cid, status, result) => {
        expect(cid).toBe('2');
        expect(status).toBe('executing');
        expect(result).toBeUndefined();
      }
    );

    const queue = queueManager.getQueue();

    expect(queue.length).toBe(2);
    expect(queue[0].cid).toBe('1');
  });
});
