import clsx from "clsx";
import { memo } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { escapeRegExp } from "@pancakeswap/utils/escapeRegExp";
import { SwapCSS } from "@pancakeswap/uikit";
import styled from "styled-components";

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

const InputBox = styled.div`
  border: 1px solid gray;
  border-radius: 4px;
  position: relative;
  min-height: 32px;
  width: 100%;
  padding: 6px 20px;
  input {
    width: 100%;
    font-size: 13px;
  }
`;

const BottomLeft = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
`;

const BottomRight = styled.img`
  position: absolute;
  bottom: 0;
  right: 0;
`;

type NumericalInputProps = {
  value: string | number;
  onUserInput: (input: string) => void;
  fontSize?: string;
} & SwapCSS.InputVariants &
  Omit<React.HTMLProps<HTMLInputElement>, "ref" | "onChange" | "as">;

export const ENumericalInput = memo(function InnerInput({
  value,
  onUserInput,
  placeholder,
  error,
  align,
  className,
  loading,
  ...rest
}: NumericalInputProps) {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === "" || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput);
    }
  };

  const { t } = useTranslation();

  return (
    <InputBox>
      <input
        className={clsx(
          className,
          SwapCSS.inputVariants({
            error,
            align,
            loading,
          })
        )}
        {...rest}
        value={value}
        onChange={(event) => {
          // replace commas with periods, because we exclusively uses period as the decimal separator
          enforcer(event.target.value.replace(/,/g, "."));
        }}
        // universal input options
        inputMode="decimal"
        title={t("Token Amount")}
        autoComplete="off"
        autoCorrect="off"
        // text-specific options
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$"
        placeholder={placeholder || "0.0"}
        minLength={1}
        maxLength={79}
        spellCheck="false"
      />
    </InputBox>
  );
});
