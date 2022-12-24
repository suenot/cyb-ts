import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context';
import tokenList from '../utils/tokenList';

export function isNative(denom) {
  if (denom) {
    return denom.indexOf('ibc/') !== 0;
  }
  return false;
}

export const findDenomInTokenList = (baseDenom) => {
  let demonInfo = null;

  const findObj = tokenList.find((item) => item.coinMinimalDenom === baseDenom);

  if (findObj) {
    demonInfo = { ...findObj };
  }

  return demonInfo;
};

export const useTraseDenom = (denomTrase) => {
  const { ibcDataDenom } = useContext(AppContext);
  const [infoDenom, setInfoDenom] = useState({
    denom: denomTrase,
    coinDecimals: 0,
    path: '',
    coinImageCid: '',
  });

  useEffect(() => {
    if (ibcDataDenom !== null) {
      if (!isNative(denomTrase)) {
        if (Object.prototype.hasOwnProperty.call(ibcDataDenom, denomTrase)) {
          const { baseDenom, sourceChannelId: sourceChannelIFromPath } =
            ibcDataDenom[denomTrase];
          const denomInfoFromList = findDenomInTokenList(baseDenom);

          let infoDenomTemp = {
            denom: baseDenom,
            coinDecimals: 0,
            path: sourceChannelIFromPath,
            coinImageCid: '',
          };

          if (denomInfoFromList !== null) {
            const { denom, counterpartyChainId, coinImageCid, coinDecimals } =
              denomInfoFromList;

            infoDenomTemp = {
              denom,
              coinDecimals,
              coinImageCid,
              path: `${counterpartyChainId}/${sourceChannelIFromPath}`,
            };
          }
          setInfoDenom((item) => ({ ...item, ...infoDenomTemp }));
        }
      } else {
        let infoDenomTemp = {
          denom: denomTrase.toUpperCase(),
          coinDecimals: 0,
        };
        const denomInfoFromList = findDenomInTokenList(denomTrase);

        if (denomInfoFromList !== null) {
          const { denom, coinDecimals } = denomInfoFromList;
          infoDenomTemp = {
            denom,
            coinDecimals,
          };
        }
        setInfoDenom((item) => ({ ...item, ...infoDenomTemp }));
      }
    }
  }, [ibcDataDenom, denomTrase]);

  return { infoDenom };
};