import { Text, AtomBox, SwapCSS } from "@pancakeswap/uikit";

import { NumericalInputProps } from "./NumericalInput";
import { ENumericalInput } from "./ENumericalInput";

interface CurrencyInputPanelProps extends Omit<NumericalInputProps, "onBlur"> {
  onInputBlur?: () => void;
  id: string;
  top?: React.ReactNode;
  bottom?: React.ReactNode;
  showBridgeWarning?: boolean;
}

export function CurrencyInputPanel({
  value,
  onUserInput,
  onInputBlur,
  top,
  bottom,
  id,
  disabled,
  error,
  loading,
  showBridgeWarning,
}: CurrencyInputPanelProps) {
  return (
    <AtomBox position="relative" id={id} display="grid">
      <AtomBox display="flex" alignItems="center" justifyContent="space-between">
        {top}
      </AtomBox>
      <AtomBox display="flex" flexDirection="column" flexWrap="nowrap" position="relative" zIndex="1">
        {bottom && (
          <AtomBox
            as="label"
            className={SwapCSS.inputContainerVariants({
              showBridgeWarning: !!showBridgeWarning,
              error: Boolean(error),
            })}
          >
            <AtomBox
              display="flex"
              flexDirection="row"
              flexWrap="nowrap"
              color="text"
              fontSize="12px"
              lineHeight="16px"
              mb="2px"
            >
              <ENumericalInput
                error={Boolean(error)}
                disabled={disabled}
                loading={loading}
                className="token-amount-input"
                value={value}
                onBlur={onInputBlur}
                onUserInput={(val) => {
                  onUserInput(val);
                }}
              />
            </AtomBox>
            {bottom}
          </AtomBox>
        )}

        {error ? (
          <Text pb="8px" fontSize="12px" color="red">
            {error}
          </Text>
        ) : null}

        {disabled && <AtomBox role="presentation" position="absolute" inset="0px" opacity="0.6" />}
      </AtomBox>
    </AtomBox>
  );
}
