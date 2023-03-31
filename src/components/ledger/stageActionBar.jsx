import { useState, useEffect } from 'react';
import LocalizedStrings from 'react-localization';
import { Link } from 'react-router-dom';
import {
  ActionBar,
  Button,
  Input,
  Pane,
  Text,
  Battery,
  IconButton,
} from '@cybercongress/gravity';
import TextareaAutosize from 'react-textarea-autosize';
import Tooltip from '../tooltip/tooltip';
import { ContainetLedger } from './container';
import { Dots } from '../ui/Dots';
import Account from '../account/account';
import { LinkWindow } from '../link/link';
import { formatNumber, trimString, selectNetworkImg } from '../../utils/utils';
import ButtonImgText from '../Button/buttonImgText';

import { i18n } from '../../i18n/en';

import { CYBER, BOND_STATUS } from '../../utils/config';

const { DENOM_CYBER } = CYBER;

const param = {
  slashing: [
    'signed_blocks_window',
    'min_signed_per_window',
    'downtime_jail_duration',
    'slash_fraction_double_sign',
    'slash_fraction_downtime',
  ],
  bandwidth: [
    'tx_cost',
    'link_msg_cost',
    'non_link_msg_cost',
    'recovery_period',
    'adjust_price_period',
    'base_credit_price',
    'desirable_bandwidth',
    'max_block_bandwidth',
  ],
  distribution: [
    'community_tax',
    'base_proposer_reward',
    'bonus_proposer_reward',
    'withdraw_addr_enabled',
  ],
  mint: [
    'mint_denom',
    'inflation_rate_change',
    'inflation_max',
    'inflation_min',
    'goal_bonded',
    'blocks_per_year',
  ],
  evidence: ['max_evidence_age'],
  auth: [
    'max_memo_characters',
    'tx_sig_limit',
    'tx_size_cost_per_byte',
    'sig_verify_cost_ed25519',
    'sig_verify_cost_secp256k1',
  ],
  rank: ['calculation_period', 'damping_factor', 'tolerance'],
  staking: [
    'unbonding_time',
    'max_validators',
    'max_entries',
    'historical_entries',
    'bond_denom',
  ],
  gov: {
    deposit_params: ['min_deposit', 'max_deposit_period'],
    voting_params: ['voting_period'],
    tally_params: ['quorum', 'threshold', 'veto'],
  },
};

const imgLedger = require('../../image/ledger.svg');
const imgKeplr = require('../../image/keplr-icon.svg');
const imgMetaMask = require('../../image/mm-logo.svg');
const imgRead = require('../../image/duplicate-outline.svg');
const imgEth = require('../../image/Ethereum_logo_2014.svg');
const imgCosmos = require('../../image/cosmos-2.svg');

const T = new LocalizedStrings(i18n);
const ledger = require('../../image/select-pin-nano2.svg');

const toPascalCase = (str) =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[a-zA-Z0-9]+/g)
    .map((cht) => cht.charAt(0).toUpperCase() + cht.substr(1).toLowerCase())
    .join('');

export function ActionBarContentText({ children, ...props }) {
  return (
    <Pane
      display="flex"
      fontSize="20px"
      justifyContent="center"
      alignItems="center"
      flexGrow={1}
      marginRight="15px"
      {...props}
    >
      {children}
    </Pane>
  );
}

export function ButtonIcon({
  img,
  active,
  disabled,
  text,
  placement = 'top',
  styleContainer,
  ...props
}) {
  return (
    <Pane style={styleContainer}>
      <Tooltip placement={placement} tooltip={<Pane>{text}</Pane>}>
        <button
          type="button"
          style={{
            // boxShadow: active ? '0px 6px 3px -2px #36d6ae' : 'none',
            margin: '0 10px',
            padding: '5px 0',
          }}
          className={`container-buttonIcon ${active ? 'active-icon' : ''}`}
          disabled={disabled}
          {...props}
        >
          <img src={img} alt="img" />
        </button>
      </Tooltip>
    </Pane>
  );
}

export function JsonTransaction() {
  return (
    <ActionBar>
      <ActionBarContentText>
        Confirm transaction on your Ledger{' '}
        <img
          alt="legder"
          style={{
            paddingTop: '8px',
            marginLeft: '10px',
            width: '150px',
            height: '50px',
          }}
          src={ledger}
        />
      </ActionBarContentText>
    </ActionBar>
  );
}

export function TransactionSubmitted() {
  return (
    <ActionBar>
      <ActionBarContentText>
        Please wait while we confirm the transaction on the blockchain{' '}
        <Dots big />
      </ActionBarContentText>
    </ActionBar>
  );
}

export function Confirmed({ txHash, txHeight, cosmos, onClickBtnCloce }) {
  return (
    <ActionBar>
      <ActionBarContentText display="inline">
        <Pane display="inline">Transaction</Pane>{' '}
        {cosmos ? (
          <LinkWindow to={`https://www.mintscan.io/txs/${txHash}`}>
            {trimString(txHash, 6, 6)}
          </LinkWindow>
        ) : (
          <Link to={`/network/bostrom/tx/${txHash}`}>
            {trimString(txHash, 6, 6)}
          </Link>
        )}{' '}
        <Pane display="inline">
          was included in the block <br /> at height{' '}
          {formatNumber(parseFloat(txHeight))}
        </Pane>
      </ActionBarContentText>
      <Button marginX={10} onClick={onClickBtnCloce}>
        Fuck Google
      </Button>
    </ActionBar>
  );
}

export function TransactionError({ onClickBtn, errorMessage }) {
  return (
    <ActionBar>
      <ActionBarContentText display="block">
        Message Error: {errorMessage}
      </ActionBarContentText>
      <Button marginX={10} onClick={onClickBtn}>
        {T.actionBar.confirmedTX.continue}
      </Button>
    </ActionBar>
  );
}

export function ConnectLadger({ connectLedger, onClickConnect }) {
  return (
    <ActionBar>
      <ActionBarContentText display="inline-flex" flexDirection="column">
        <div>
          Connect Ledger, enter pin and open Cosmos app <Dots big />
        </div>
        {connectLedger === false && (
          <Pane fontSize="14px" color="#f00">
            Cosmos app is not open
          </Pane>
        )}
      </ActionBarContentText>
      {connectLedger === false && (
        <Button onClick={onClickConnect}>Connect</Button>
      )}
    </ActionBar>
  );
}

export function CheckAddressInfo() {
  return (
    <ActionBar>
      <ActionBarContentText>
        {T.actionBar.connectLadger.getDetails} <Dots big />
      </ActionBarContentText>
    </ActionBar>
  );
}

export function StartStageSearchActionBar({
  onClickBtn,
  contentHash,
  onChangeInputContentHash,
  showOpenFileDlg,
  inputOpenFileRef,
  onChangeInput,
  onClickClear,
  file,
  textBtn = 'Cyberlink',
  placeholder = 'add keywords, hash or file',
  keys = 'ledger',
}) {
  return (
    <ActionBar>
      <Pane width="65%" alignItems="flex-end" display="flex">
        <ActionBarContentText>
          <Pane
            display="flex"
            flexDirection="column"
            position="relative"
            width="100%"
          >
            <TextareaAutosize
              value={contentHash}
              maxRows={20}
              style={{
                height: 42,
                width: '100%',
                color: '#fff',
                paddingLeft: '10px',
                borderRadius: '20px',
                textAlign: 'start',
                paddingRight: '35px',
                paddingTop: '10px',
                paddingBottom: '10px',
              }}
              className="resize-none minHeightTextarea"
              onChange={(e) => onChangeInputContentHash(e)}
              placeholder={placeholder}
              onFocus={(e) => {
                e.target.placeholder = '';
              }}
              onBlur={(e) => {
                e.target.placeholder = placeholder;
              }}
            />
            <Pane
              position="absolute"
              right="0"
              bottom="0"
              transform="translate(0, -7px)"
            >
              <input
                ref={inputOpenFileRef}
                onChange={() => onChangeInput(inputOpenFileRef)}
                type="file"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                aria-label="add file"
                className={
                  file !== null && file !== undefined
                    ? 'btn-add-close'
                    : 'btn-add-file'
                }
                onClick={
                  file !== null && file !== undefined
                    ? onClickClear
                    : showOpenFileDlg
                }
              />
            </Pane>
          </Pane>
        </ActionBarContentText>
        <ButtonImgText
          text={
            <Pane alignItems="center" display="flex">
              {textBtn}{' '}
              <img
                src={selectNetworkImg(CYBER.CHAIN_ID)}
                alt="cyber"
                style={{
                  width: 20,
                  height: 20,
                  marginLeft: '5px',
                  paddingTop: '2px',
                  objectFit: 'contain',
                }}
              />
            </Pane>
          }
          disabled={!contentHash.length}
          onClick={onClickBtn}
          img={keys === 'ledger' ? imgLedger : imgKeplr}
        />
      </Pane>
    </ActionBar>
  );
}

export function GovernanceStartStageActionBar({
  valueSelect,
  onChangeSelect,
  onClickBtn,
}) {
  return (
    <ActionBar>
      <ActionBarContentText>
        <select
          style={{ height: 42, width: '60%' }}
          className="select-green"
          value={valueSelect}
          onChange={onChangeSelect}
        >
          <option value="textProposal">Text Proposal</option>
          {/* <option value="communityPool">Community Pool Spend</option>
        <option value="paramChange">Param Change</option>
        <option value="softwareUpgrade">Software Upgrade</option> */}
        </select>
      </ActionBarContentText>
      <Button onClick={onClickBtn}>Propose</Button>
    </ActionBar>
  );
}

export function GovernanceChangeParam({
  valueSelect,
  onChangeSelect,
  onClickBtn,
  onClickBtnAddParam,
  valueParam = '',
  onChangeInputParam,
  changeParam,
  onClickDeleteParam,
  onClickBtnCloce,
  valueTitle,
  onChangeInputTitle,
  onChangeInputDescription,
  valueDescription,
  valueDeposit,
  onChangeInputDeposit,
}) {
  const item = [];
  let itemChangeParam = [];

  Object.keys(param).map((key) => {
    if (param[key].constructor.name === 'Array') {
      item.push(
        <option
          style={{ color: '#fff', fontSize: '20px' }}
          disabled="disabled"
          key={key}
          value=""
        >
          {key}
        </option>
      );
      const temp = param[key].map((items) => (
        <option
          key={items}
          value={JSON.stringify({
            subspace: key,
            key: toPascalCase(items),
            value: '',
          })}
        >
          {toPascalCase(items)}
        </option>
      ));
      if (temp) {
        item.push(...temp);
      }
    }
    return undefined;
  });

  if (changeParam.length > 0) {
    itemChangeParam = changeParam.map((items, index) => (
      <Pane width="100%" display="flex" key={items.key}>
        <Pane flex={1}>{items.key}</Pane>
        <Pane flex={1}>{items.value}</Pane>
        <IconButton
          onClick={() => onClickDeleteParam(index)}
          appearance="minimal"
          height={24}
          icon="trash"
          intent="danger"
        />
      </Pane>
    ));
  }

  return (
    <ActionBar>
      <ContainetLedger
        styles={{ height: 'unset' }}
        logo
        onClickBtnCloce={onClickBtnCloce}
      >
        <Pane display="flex" flexDirection="column" alignItems="center">
          <Text fontSize="25px" lineHeight="40px" color="#fff">
            Parameter Change Proposal
          </Text>
          <Pane marginY={10} width="100%">
            <Text color="#fff">title</Text>
            <input
              value={valueTitle}
              style={{
                height: 42,
                width: '100%',
              }}
              onChange={onChangeInputTitle}
              placeholder="title"
            />
          </Pane>
          <Pane width="100%">
            <Text color="#fff">description</Text>
            <textarea
              onChange={onChangeInputDescription}
              value={valueDescription}
              className="resize-none"
            />
          </Pane>
          <Pane marginY={10} width="100%">
            <Text color="#fff">deposit, GEUL</Text>
            <input
              value={valueDeposit}
              style={{
                height: 42,
                width: '100%',
              }}
              onChange={onChangeInputDeposit}
              placeholder="amount, GEUL"
            />
          </Pane>
          <Pane marginBottom={10}>
            <Text color="#fff">parameters</Text>
            <Pane display="flex">
              <select
                style={{ height: 42, marginLeft: 0, width: '210px' }}
                className="select-green"
                value={valueSelect}
                onChange={onChangeSelect}
              >
                {item !== undefined && item}
              </select>
              <input
                value={valueParam}
                disabled={valueSelect.length === 0}
                style={{
                  height: 42,
                  width: '200px',
                  marginRight: 15,
                }}
                onChange={onChangeInputParam}
                placeholder="value"
              />
              <Button
                disabled={valueSelect.length === 0 || valueParam.length === 0}
                onClick={onClickBtnAddParam}
              >
                Add
              </Button>
            </Pane>
          </Pane>
          {itemChangeParam.length > 0 && (
            <>
              <Pane marginBottom={10} width="100%" display="flex">
                <Pane flex={1}>Change Param</Pane>
                <Pane flex={1}>Value</Pane>
              </Pane>
              <Pane marginBottom={20} width="100%">
                {itemChangeParam}
              </Pane>
            </>
          )}

          <Button
            disabled={itemChangeParam.length === 0}
            marginTop={25}
            onClick={onClickBtn}
          >
            Create Governance
          </Button>
        </Pane>
      </ContainetLedger>
    </ActionBar>
  );
}

export function GovernanceSoftwareUpgrade({
  onClickBtn,
  onClickBtnCloce,
  onChangeInputTitle,
  onChangeInputDescription,
  onChangeInputDeposit,
  valueDescription,
  valueTitle,
  valueDeposit,
  valueHeightUpgrade,
  valueNameUpgrade,
  onChangeInputValueNameUpgrade,
  onChangeInputValueHeightUpgrade,
}) {
  return (
    <ActionBar>
      <ContainetLedger logo onClickBtnCloce={onClickBtnCloce}>
        <Pane display="flex" flexDirection="column" alignItems="center">
          <Text fontSize="25px" lineHeight="40px" color="#fff">
            Software Upgrade Proposal
          </Text>
          <Pane marginY={10} width="100%">
            <Text color="#fff">title</Text>
            <input
              value={valueTitle}
              style={{
                height: 42,
                width: '100%',
              }}
              onChange={onChangeInputTitle}
              placeholder="title"
            />
          </Pane>
          <Pane marginBottom={10} width="100%">
            <Text color="#fff">description</Text>
            <textarea
              onChange={onChangeInputDescription}
              value={valueDescription}
              className="resize-none"
            />
          </Pane>
          <Pane marginY={10} width="100%">
            <Text color="#fff">Upgrade name</Text>
            <input
              value={valueNameUpgrade}
              style={{
                height: 42,
                width: '100%',
              }}
              onChange={onChangeInputValueNameUpgrade}
              placeholder="title"
            />
          </Pane>
          <Pane marginY={10} width="100%">
            <Text color="#fff">Upgrade height</Text>
            <input
              value={valueHeightUpgrade}
              style={{
                height: 42,
                width: '100%',
              }}
              onChange={onChangeInputValueHeightUpgrade}
              placeholder="title"
            />
          </Pane>
          <Pane width="100%">
            <Text color="#fff">deposit, GEUL</Text>
            <input
              value={valueDeposit}
              style={{
                height: 42,
                width: '100%',
              }}
              onChange={onChangeInputDeposit}
              placeholder="amount, GEUL"
            />
          </Pane>
          <Button marginTop={25} onClick={onClickBtn}>
            Create Governance
          </Button>
        </Pane>
      </ContainetLedger>
    </ActionBar>
  );
}

export function TextProposal({
  onClickBtn,
  // addrProposer,
  onClickBtnCloce,
  onChangeInputTitle,
  onChangeInputDescription,
  onChangeInputDeposit,
  valueDescription,
  valueTitle,
  valueDeposit,
}) {
  return (
    <ActionBar>
      <ContainetLedger logo onClickBtnCloce={onClickBtnCloce}>
        <Pane display="flex" flexDirection="column" alignItems="center">
          <Text fontSize="25px" lineHeight="40px" color="#fff">
            Text Proposal
          </Text>
          {/* <Text fontSize="18px" lineHeight="40px" color="#fff">
          proposer
        </Text>
        <Text color="#fff">{addrProposer}</Text> */}
          <Pane marginY={10} width="100%">
            <Text color="#fff">title</Text>
            <input
              value={valueTitle}
              style={{
                height: 42,
                width: '100%',
              }}
              onChange={onChangeInputTitle}
              placeholder="title"
            />
          </Pane>
          <Pane marginBottom={10} width="100%">
            <Text color="#fff">description</Text>
            <textarea
              onChange={onChangeInputDescription}
              value={valueDescription}
              className="resize-none"
            />
          </Pane>
          <Pane width="100%">
            <Text color="#fff">deposit, {CYBER.DENOM_CYBER.toUpperCase()}</Text>
            <input
              value={valueDeposit}
              style={{
                height: 42,
                width: '100%',
              }}
              onChange={onChangeInputDeposit}
              placeholder={`amount, ${CYBER.DENOM_CYBER.toUpperCase()}`}
            />
          </Pane>
          <Button marginTop={25} onClick={onClickBtn}>
            Create Governance
          </Button>
        </Pane>
      </ContainetLedger>
    </ActionBar>
  );
}

// function ParamChange({ onClickBtn }) {
//   return (
//     <ActionBar>
//       <ActionBarContentText>
//         {/* <select
//         style={{ height: 42, width: '60%' }}
//         className="select-green"
//         value={valueSelect}
//         onChange={onChangeSelect}
//       >
//         <option value="textProposal">Text Proposal</option>
//         <option value="paramChange">Param Change</option>
//         <option value="communityPool">Community Pool Spend</option>
//       </select> */}
//       </ActionBarContentText>
//       <Button onClick={onClickBtn}>Create Governance</Button>
//     </ActionBar>
//   );
// }

export function CommunityPool({
  onClickBtn,
  // addrProposer,
  onClickBtnCloce,
  onChangeInputTitle,
  onChangeInputDescription,
  onChangeInputDeposit,
  valueDescription,
  valueTitle,
  valueDeposit,
  valueAddressRecipient,
  onChangeInputAmountRecipient,
  onChangeInputAddressRecipient,
  valueAmountRecipient,
}) {
  return (
    <ActionBar>
      <ContainetLedger logo onClickBtnCloce={onClickBtnCloce}>
        <Pane display="flex" flexDirection="column" alignItems="center">
          <Text fontSize="25px" lineHeight="40px" color="#fff">
            Community Pool Spend
          </Text>
          {/* <Text fontSize="18px" lineHeight="40px" color="#fff">
          proposer
        </Text>
        <Text color="#fff">{addrProposer}</Text> */}
          <Pane marginY={10} width="100%">
            <Text color="#fff">title</Text>
            <input
              value={valueTitle}
              style={{
                height: 42,
                width: '100%',
              }}
              onChange={onChangeInputTitle}
              placeholder="title"
            />
          </Pane>
          <Pane marginBottom={10} width="100%">
            <Text color="#fff">description</Text>
            <textarea
              onChange={onChangeInputDescription}
              value={valueDescription}
              className="resize-none"
            />
          </Pane>
          <Pane marginBottom={10} width="100%">
            <Text color="#fff">recipient</Text>
            <Pane
              display="grid"
              gridTemplateColumns="0.8fr 0.2fr"
              gridGap="10px"
            >
              <input
                value={valueAddressRecipient}
                style={{
                  height: 42,
                  width: '100%',
                }}
                onChange={onChangeInputAddressRecipient}
                placeholder="address"
              />
              <input
                value={valueAmountRecipient}
                style={{
                  height: 42,
                  width: '100%',
                }}
                onChange={onChangeInputAmountRecipient}
                placeholder="GEUL"
              />
            </Pane>
          </Pane>
          <Pane width="100%">
            <Text color="#fff">deposit, EUL</Text>
            <input
              value={valueDeposit}
              style={{
                height: 42,
                width: '100%',
              }}
              onChange={onChangeInputDeposit}
              placeholder="amount, GEUL"
            />
          </Pane>
          <Button marginTop={25} onClick={onClickBtn}>
            Create Governance
          </Button>
        </Pane>
      </ContainetLedger>
    </ActionBar>
  );
}

function ContentTooltip({ bwRemained, bwMaxValue, linkPrice }) {
  return (
    <Pane
      minWidth={200}
      paddingX={18}
      paddingY={14}
      borderRadius={4}
      backgroundColor="#fff"
    >
      <Pane marginBottom={5}>
        <Text size={300}>
          You have {bwRemained} BP out of {bwMaxValue} BP.
        </Text>
      </Pane>
      <Pane marginBottom={5}>
        <Text size={300}>
          Full regeneration of bandwidth points or BP happens in 24 hours.
        </Text>
      </Pane>
      <Pane display="flex">
        <Text size={300}>Current rate for 1 cyberlink is {linkPrice} BP.</Text>
      </Pane>
    </Pane>
  );
}

export function Cyberlink({
  bandwidth,
  address,
  contentHash,
  onClickBtn,
  query,
  disabledBtn,
  linkPrice,
}) {
  return (
    <ActionBar>
      <ActionBarContentText flexDirection="column">
        <Pane>
          <Pane display="flex">
            <Pane display="flex" alignItems="center" marginRight={10}>
              <Pane fontSize="16px" marginRight={5}>
                address:
              </Pane>
              <Text fontSize="16px" lineHeight="25.888px" color="#fff">
                {address}
              </Text>
            </Pane>
            <Pane display="flex" alignItems="center">
              <Pane fontSize="16px" marginRight={5}>
                bandwidth:
              </Pane>
              <Battery
                style={{ width: '140px', height: '16px' }}
                bwPercent={Math.floor(
                  (bandwidth.remained / bandwidth.max_value) * 100
                )}
                contentTooltip={
                  <ContentTooltip
                    bwRemained={Math.floor(bandwidth.remained)}
                    bwMaxValue={Math.floor(bandwidth.max_value)}
                    linkPrice={Math.floor(linkPrice)}
                  />
                }
              />
            </Pane>
          </Pane>
          <Pane display="flex" flexDirection="column">
            <Text color="#fff" marginRight={10} fontSize="16px">
              {T.actionBar.link.from}{' '}
              {contentHash.length > 12
                ? trimString(contentHash, 6, 6)
                : contentHash}
            </Text>
            <Text color="#fff" fontSize="16px">
              {T.actionBar.link.to} {query}
            </Text>
          </Pane>
        </Pane>
      </ActionBarContentText>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // width: '100%',
        }}
      >
        <button
          type="button"
          className="btn-disabled"
          onClick={onClickBtn}
          style={{ height: 42, maxWidth: '200px' }}
          disabled={disabledBtn}
        >
          {T.actionBar.link.cyberIt}
        </button>
      </div>
    </ActionBar>
  );
}

function IntupAutoSize({ value, onChangeInputAmount, placeholder }) {
  function isOverflown(element) {
    return element.scrollWidth > element.clientWidth;
  }

  function changefontsize() {
    const myInput = document.getElementById('myInput');
    let currentfontsize = 18;
    if (myInput && myInput !== null) {
      if (isOverflown(myInput)) {
        while (isOverflown(myInput)) {
          currentfontsize -= 1;
          myInput.style.fontSize = `${currentfontsize}px`;
        }
      } else {
        currentfontsize = 18;
        myInput.style.fontSize = `${currentfontsize}px`;
        while (isOverflown(myInput)) {
          currentfontsize -= 1;
          myInput.style.fontSize = `${currentfontsize}px`;
        }
      }
    }
  }

  return (
    <Input
      width="125px"
      value={value}
      style={{
        height: 42,
        width: '125px',
        marginLeft: 20,
        textAlign: 'end',
      }}
      id="myInput"
      onkeypress={changefontsize()}
      autoFocus
      onChange={onChangeInputAmount}
      placeholder={placeholder}
    />
  );
}

export function Delegate({
  moniker,
  generateTx,
  onChangeInputAmount,
  toSend,
  disabledBtn,
  delegate,
}) {
  return (
    <ActionBar>
      <ActionBarContentText>
        <Text fontSize="16px" color="#fff">
          {T.actionBar.delegate.enterAmount} {DENOM_CYBER.toUpperCase()}{' '}
          {delegate
            ? T.actionBar.delegate.delegate
            : T.actionBar.delegate.unDelegateFrom}{' '}
          <Text fontSize="20px" color="#fff" fontWeight={600}>
            {moniker.length > 14 ? `${moniker.substring(0, 14)}...` : moniker}
          </Text>
        </Text>
        <IntupAutoSize
          value={toSend}
          onChangeInputAmount={onChangeInputAmount}
          placeholder="amount"
        />
      </ActionBarContentText>
      <button
        type="button"
        className="btn-disabled"
        onClick={generateTx}
        style={{ height: 42, maxWidth: '200px' }}
        disabled={disabledBtn}
      >
        {T.actionBar.delegate.generate}
      </button>
    </ActionBar>
  );
}

export function ReDelegate({
  generateTx,
  onChangeInputAmount,
  toSend,
  disabledBtn,
  validators,
  validatorsAll,
  valueSelect,
  onChangeReDelegate,
}) {
  return (
    <ActionBar>
      <ActionBarContentText>
        <Text marginRight={5} fontSize="16px" color="#fff">
          amount{' '}
        </Text>
        <Input
          value={toSend}
          autoFocus
          height="32px"
          width="70px"
          textAlign="end"
          onChange={onChangeInputAmount}
          placeholder="amount"
        />
        <Text marginLeft={5} fontSize="16px" color="#fff">
          {DENOM_CYBER.toUpperCase()} restake from{' '}
          <Text fontSize="20px" color="#fff" fontWeight={600}>
            {validators.description.moniker.length > 14
              ? `${validators.description.moniker.substring(0, 14)}...`
              : validators.description.moniker}
          </Text>
        </Text>
        <Text marginX={5} fontSize="16px" color="#fff">
          to:
        </Text>
        <select
          style={{
            width: '120px',
          }}
          value={valueSelect}
          onChange={onChangeReDelegate}
        >
          <option value="">pick hero</option>
          {validatorsAll
            .filter(
              (validator) =>
                BOND_STATUS[validator.status] === BOND_STATUS.BOND_STATUS_BONDED
            )
            .map((item) => (
              <option
                key={item.operatorAddress}
                value={item.operatorAddress}
                style={{
                  display:
                    validators.operatorAddress === item.operatorAddress
                      ? 'none'
                      : 'block',
                }}
              >
                {item.description.moniker}
              </option>
            ))}
        </select>
      </ActionBarContentText>
      <button
        type="button"
        className="btn-disabled"
        onClick={generateTx}
        style={{ height: 42, maxWidth: '200px' }}
        disabled={disabledBtn}
      >
        {T.actionBar.delegate.generate}
      </button>
    </ActionBar>
  );
}

export function SendLedger({
  onClickBtn,
  valueInputAmount,
  valueInputAddressTo,
  onChangeInputAmount,
  onChangeInputAddressTo,
  disabledBtn,
  addressToValid,
  amountSendInputValid,
}) {
  return (
    <ActionBar>
      <Pane display="flex" className="contentItem">
        <ActionBarContentText>
          <Input
            value={valueInputAddressTo}
            height={42}
            marginRight={10}
            width="300px"
            onChange={onChangeInputAddressTo}
            placeholder="cyber address To"
            isInvalid={addressToValid !== null}
            message={addressToValid}
          />

          <Input
            value={valueInputAmount}
            height={42}
            width="24%"
            onChange={onChangeInputAmount}
            placeholder={CYBER.DENOM_CYBER}
            isInvalid={amountSendInputValid !== null}
            message={amountSendInputValid}
          />
        </ActionBarContentText>
        <button
          type="button"
          className="btn-disabled"
          disabled={disabledBtn}
          onClick={onClickBtn}
        >
          Generate Tx
        </button>
      </Pane>
    </ActionBar>
  );
}

export function RewardsDelegators({
  data,
  onClickBtn,
  onClickBtnCloce,
  disabledBtn,
}) {
  console.log('data :>> ', data);
  const itemReward = data.rewards.map((item) => {
    if (item.reward !== null) {
      return (
        <Pane
          key={item.validator_address}
          display="flex"
          justifyContent="space-between"
        >
          <Account address={item.validator_address} />
          <Pane>
            {formatNumber(Math.floor(item.reward[0].amount))}{' '}
            {CYBER.DENOM_CYBER.toUpperCase()}
          </Pane>
        </Pane>
      );
    }
    return undefined;
  });
  return (
    <ContainetLedger onClickBtnCloce={onClickBtnCloce}>
      <Pane fontSize="20px" marginBottom={20}>
        Total rewards: {formatNumber(Math.floor(data.total[0].amount))}{' '}
        {CYBER.DENOM_CYBER.toUpperCase()}
      </Pane>
      Rewards:
      <Pane marginTop={10} marginBottom={30}>
        <Pane marginBottom={5} display="flex" justifyContent="space-between">
          <Pane>Address</Pane>
          <Pane>Amount</Pane>
        </Pane>
        <Pane>{itemReward}</Pane>
      </Pane>
      <div className="text-align-center">
        <button
          type="button"
          className="btn-disabled"
          disabled={disabledBtn}
          onClick={onClickBtn}
        >
          {T.actionBar.send.generate}
        </button>
      </div>
    </ContainetLedger>
  );
}

export function ConnectAddress({
  selectMethodFunc,
  selectMethod,
  selectNetworkFunc,
  selectNetwork,
  connctAddress,
  web3,
  selectAccount,
  keplr,
}) {
  const [cyberNetwork, setCyberNetwork] = useState(true);
  const [cosmosNetwork, setCosmosNetwork] = useState(true);
  const [ethNetwork, setEthrNetwork] = useState(true);

  useEffect(() => {
    if (selectAccount && selectAccount !== null) {
      if (selectAccount.cyber) {
        setCyberNetwork(false);
      } else {
        setCyberNetwork(true);
      }
      if (selectAccount.cosmos) {
        setCosmosNetwork(false);
      } else {
        setCosmosNetwork(true);
      }
      if (selectAccount.eth) {
        setEthrNetwork(false);
      } else {
        setEthrNetwork(true);
      }
    } else {
      setEthrNetwork(true);
      setCosmosNetwork(true);
      setCyberNetwork(true);
    }
  }, [selectAccount]);

  return (
    <ActionBar>
      <ActionBarContentText>
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          flex={1}
        >
          {(cyberNetwork || cosmosNetwork) && (
            <>
              {/* <ButtonIcon
                onClick={() => selectMethodFunc('ledger')}
                active={selectMethod === 'ledger'}
                img={imgLedger}
                text="ledger"
              /> */}
              {keplr ? (
                <ButtonIcon
                  onClick={() => selectMethodFunc('keplr')}
                  active={selectMethod === 'keplr'}
                  img={imgKeplr}
                  text="keplr"
                />
              ) : (
                <LinkWindow to="https://www.keplr.app/">
                  <Pane marginRight={5} width={34} height={30}>
                    <img
                      style={{ width: '34px', height: '30px' }}
                      src={imgKeplr}
                      alt="icon"
                    />
                  </Pane>
                </LinkWindow>
              )}
            </>
          )}
          {web3 && web3 !== null && ethNetwork && (
            <ButtonIcon
              onClick={() => selectMethodFunc('MetaMask')}
              active={selectMethod === 'MetaMask'}
              img={imgMetaMask}
              text="metaMask"
            />
          )}
          {(cyberNetwork || cosmosNetwork) && (
            <ButtonIcon
              onClick={() => selectMethodFunc('read-only')}
              active={selectMethod === 'read-only'}
              img={imgRead}
              text="read-only"
            />
          )}
        </Pane>
        <span style={{ fontSize: '18px' }}>in</span>
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          flex={1}
        >
          {selectMethod === 'MetaMask' && (
            <ButtonIcon
              img={imgEth}
              text="eth"
              onClick={() => selectNetworkFunc('eth')}
              active={selectNetwork === 'eth'}
            />
          )}
          {selectMethod !== 'MetaMask' && (
            <>
              {cyberNetwork && (
                <ButtonIcon
                  onClick={() => selectNetworkFunc('cyber')}
                  active={selectNetwork === 'cyber'}
                  img={selectNetworkImg(CYBER.CHAIN_ID)}
                  text={CYBER.CHAIN_ID}
                />
              )}
              {cosmosNetwork && (
                <ButtonIcon
                  img={imgCosmos}
                  text="cosmos"
                  onClick={() => selectNetworkFunc('cosmos')}
                  active={selectNetwork === 'cosmos'}
                />
              )}
            </>
          )}
        </Pane>
      </ActionBarContentText>
      <Button
        disabled={selectNetwork === '' || selectMethod === ''}
        onClick={() => connctAddress()}
      >
        connect
      </Button>
    </ActionBar>
  );
}

// function SetHdpath({
//   hdpath,
//   onChangeAccount,
//   onChangeIndex,
//   addressLedger,
//   hdPathError,
//   addAddressLedger,
// }) {
//   return (
//     <ActionBar>
//       <ActionBarContentText>
//         <Pane>
//           <Pane
//             display="flex"
//             alignItems="center"
//             flex={1}
//             justifyContent="center"
//           >
//             <Text color="#fff" fontSize="20px">
//               HD derivation path: {hdpath[0]}/{hdpath[1]}/
//             </Text>
//             <Input
//               value={hdpath[2]}
//               onChange={(e) => onChangeAccount(e)}
//               width="50px"
//               height={42}
//               marginLeft={3}
//               marginRight={3}
//               fontSize="20px"
//               textAlign="end"
//             />
//             <Text color="#fff" fontSize="20px">
//               /{hdpath[3]}/
//             </Text>
//             <Input
//               value={hdpath[4]}
//               onChange={(e) => onChangeIndex(e)}
//               width="50px"
//               marginLeft={3}
//               height={42}
//               fontSize="20px"
//               textAlign="end"
//             />
//           </Pane>
//           {addressLedger !== null ? (
//             <Pane>{trimString(addressLedger.bech32, 10, 3)}</Pane>
//           ) : (
//             <Dots />
//           )}
//         </Pane>
//       </ActionBarContentText>
//       <Button disabled={hdPathError} onClick={() => addAddressLedger()}>
//         Apply
//       </Button>
//     </ActionBar>
//   );
// }
