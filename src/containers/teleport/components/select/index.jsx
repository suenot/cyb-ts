/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { DenomArr, Select, OptionSelect } from '../../../../components';

function SelectTeleport({
  type,
  valueSelect,
  textSelectValue,
  onChangeSelect,
  children,
  width,
  custom,
  disabled,
}) {
  return (
    <Select
      valueSelect={valueSelect}
      disabled={disabled}
      width={width}
      onChangeSelect={onChangeSelect}
      currentValue={
        custom ? (
          <OptionSelect text={textSelectValue} value={valueSelect} />
        ) : valueSelect === '' ? (
          <OptionSelect
            text="choose"
            img={
              <DenomArr justifyContent="center" denomValue="choose" onlyImg />
            }
            value=""
          />
        ) : (
          <OptionSelect
            text={
              <DenomArr
                type={type}
                denomValue={textSelectValue}
                onlyText
                tooltipStatusText={false}
              />
            }
            bgrImg={textSelectValue.includes('pool')}
            img={
              <DenomArr
                type={type}
                justifyContent="center"
                denomValue={textSelectValue}
                onlyImg
                tooltipStatusImg={false}
              />
            }
            value={valueSelect}
          />
        )
      }
    >
      {children}
    </Select>
  );
}

export default SelectTeleport;
