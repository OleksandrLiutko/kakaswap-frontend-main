import { InputHTMLAttributes } from "react";
import { styled } from "styled-components";
import Text from "../Text/Text";

interface SliderLabelProps {
  progress: string;
}

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isMax: boolean;
}

interface DisabledProp {
  disabled?: boolean;
}

const getCursorStyle = ({ disabled = false }: DisabledProp) => {
  return disabled ? "not-allowed" : "cursor";
};

const bunnyHeadMax = `"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IB2cksfwAAD6JJREFUeJy92gf4V3MbBvB/4SLrjauSTSF7bxlJ9hbZe+8V2Vv2qqQisrJHKisjM4RKJGREWkJT1v/7Pp/ncrxcxit633Nd5/r9z/md8z3Pcz/3fT/P+VVNzUzYSilzTJw4sfmNN9544nnnndfpiiuu6HPWWWe9ttdeew075phjhl111VUDu3Tp0veiiy7q1LFjx7ZjxoxpEffUmxnP/idBz/7ss8+2OeKIIx468cQTpx577LHl5JNPLkcffXTZddddy7777lv222+/ss8++5Sdd965bLPNNuXUU0/Na7baaqvSokWLaYccckivZ555Zndr/T8Dn7tnz57t2rZtO+aggw4qgXY5++yzS+vWrUurVq3KWmutVfbee+9y0003ldNOO61sv/325Y477ig33HBDadOmTenatWu5+uqry1FHHVUOOOCAsvnmm5cTTjhh7EMPPXRGrD3P/yzwb775Zt548IUR9GjIQlOgkI0qlCuvvLJcfvnlifyee+6ZSF9yySX5XdCqBKXKFltsUXbaaaf8fuONNy6bbbZZOfLII8s555yTlTvjjDPG9ujRo/20adPqz9Tgn3/++cUjgG6HH374lNgzgAsvvLAcdthh5ZRTTim33HJLufvuu8u1115bLrvssnL88cdncq47+OCDS+ggr5Ucellj//33z2MJuf7QQw/NZE866aSpsUb35557bsl/HHiUtE6Utnm7du0GBkq10IoHJFU8NGhUQpi5o4gk7rvvvjJs2LBy7733ZpBBj0T4rrvuyut32WWXpJKELr744qzUlltuWULweQ4Axx13XG2cf+OBBx7YWAx/N/i6scCOEcDIbt26lfbt2xdCxdkQbaKr7JFgefvtt8vkyZNLnz59ygcffFD69+9frr/++vLKK6+U7777rrzxxht57z333FPuv//+8tZbb5WhQ4emFtDx0ksvTR1JSBWInEbi78+6d+++i1hmGPkQ3s7xgLG33nprlloC11xzTVKGq3Tq1KmMGzeujBo1qgwZMiTF+dhjj5Uvv/wyuf/111+X119/vXz00Ud5zjrhOCW09HPSX3zxRRk9enRWC/3cd/PNNyfFJOE4NDcu7Ln1DCURLtMiAh1lYcg9+uijGQBLdHzmmWdm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"`;
const bunnyHeadMain = `"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IB2cksfwAAD6JJREFUeJy92gf4V3MbBvB/4SLrjauSTSF7bxlJ9hbZe+8V2Vv2qqQisrJHKisjM4RKJGREWkJT1v/7Pp/ncrxcxit633Nd5/r9z/md8z3Pcz/3fT/P+VVNzUzYSilzTJw4sfmNN9544nnnndfpiiuu6HPWWWe9ttdeew075phjhl111VUDu3Tp0veiiy7q1LFjx7ZjxoxpEffUmxnP/idBz/7ss8+2OeKIIx468cQTpx577LHl5JNPLkcffXTZddddy7777lv222+/ss8++5Sdd965bLPNNuXUU0/Na7baaqvSokWLaYccckivZ555Zndr/T8Dn7tnz57t2rZtO+aggw4qgXY5++yzS+vWrUurVq3KWmutVfbee+9y0003ldNOO61sv/325Y477ig33HBDadOmTenatWu5+uqry1FHHVUOOOCAsvnmm5cTTjhh7EMPPXRGrD3P/yzwb775Zt548IUR9GjIQlOgkI0qlCuvvLJcfvnlifyee+6ZSF9yySX5XdCqBKXKFltsUXbaaaf8fuONNy6bbbZZOfLII8s555yTlTvjjDPG9ujRo/20adPqz9Tgn3/++cUjgG6HH374lNgzgAsvvLAcdthh5ZRTTim33HJLufvuu8u1115bLrvssnL88cdncq47+OCDS+ggr5Ucellj//33z2MJuf7QQw/NZE866aSpsUb35557bsl/HHiUtE6Utnm7du0GBkq10IoHJFU8NGhUQpi5o4gk7rvvvjJs2LBy7733ZpBBj0T4rrvuyut32WWXpJKELr744qzUlltuWULweQ4Axx13XG2cf+OBBx7YWAx/N/i6scCOEcDIbt26lfbt2xdCxdkQbaKr7JFgefvtt8vkyZNLnz59ygcffFD69+9frr/++vLKK6+U7777rrzxxht57z333FPuv//+8tZbb5WhQ4emFtDx0ksvTR1JSBWInEbi78+6d+++i1hmGPkQ3s7xgLG33nprlloC11xzTVKGq3Tq1KmMGzeujBo1qgwZMiTF+dhjj5Uvv/wyuf/111+X119/vXz00Ud5zjrhOCW09HPSX3zxRRk9enRWC/3cd/PNNyfFJOE4NDcu7Ln1DCURLtMiAh1lYcg9+uijGQBLdHzmmWdmsI8//ngZOXJkJiYYwU2YMKH07t27/Pjjj3ksUFWAeASS5yTWt2/f8uKLL5bhw4eXzz//vHz88ccJir1Dhw4Cz3s6d+5ctt12289vv/32ln8p+EBpqQhyyNNPP51CRZWfkCiohOMeBvUQWnniiScyGFttbW354Ycf8lhlqu2rr75K9B955JE8njp1apkyZUrSbPz48ZkA+o0dOzaTQiWaefDBB8vAgQNTYzvssMPQJ598stmfBh8PbRgi7ckSeTfBEi4KKe2IESPKhx9+mN8JkFglUPH8zjvvzMScF7Dzrpdw6Clp9fLLL6fl+ts5Qb///vt5XtVoiCEATx9hAkAj8HCqnvHcBn+YQLT8ziHQ6ZAKP05uRrdMJDQmznP++ecnbyUwYMCA0q9fv0RVAngbjpVIu96nPkE/QcsSCKZWiF8CkrNGjBZJyXh+NkYAAYzADzzwwOwX+k6sNT2ef8PvBh9CaxwNZ5IAdUgPkb3jaCwZJCQhg17oArWYcfI77qJSxCgo6EtijTXWKE899VQZPHhwaoNNamqqyQTQ0rW4TmvVs2jlggsuSAA32WSTsuyyy7LXsscee0yO7xb8TQIhyOs0JA2FUI0AeA+db7/9NhGzeRi+4noIK/lJI+5FAfxml+jH31deeeXsAy+88EIiXiUu2dtuu63EcFdipiqvvfZark8br776aonhMBMUC6qpjDUBGB2/46+Cf++99xqGy0zjxbzZAzfddNOkjqDOPffc5K0giI6zCAJCmhM6CUwj49/EiT4SYYkoRIyoAf2XXnopha0yaKNvfPrpp2m3dAREFKoq65gerKu68Yxv4tpGPycQvDxF6c0yHirw7bbbLj0cIu+8804icN111yXHWR/rRDHX2FQCX1nk999/nyJmALqujowqBC9YqPbq1SvvY60cR8AtW7bMRumeTz75JHdVwATrx6yUoweXCqG3+zmBaNtDiMsDIKQb4ptgdFjBCFRpcRPaFoS4TT/g3YRGM9Uosfvuu6d7rLvuumXHHXfM/gF9a9GZStoJnAmgJMfxXM1u0qRJ5d133y3RjfN6DAEwhsQ+NIMP22uilUsAj+2VdZlTlJYAIY+XNgFwCE2LJiBCEwY3lcN7ZZeAzr3BBhuUpZdeusTjytxzz51816QkZBMgdNHVxgElpD+ovL8Nh1wQwMBR3XDDpjXRdA55+OGHU1A+3YDz5hW2F/rIINGL1dnQwcP5N/QGDRqUfo4KunU0nQze0GcSXXvttfM9QQKNGzdOd1JtoKFjTLtZQchzIbqgB7GotIrSmrE8XoQyPoIOkA+tCUfpxgVMiYJEH50UopqSpKqu7Dw3kj0xWQg9BGhh9CE21REE+2PHK664YllppZXKaqutlt+x0lVWWaXUq1cv6eC5OrCdvQLI6AIQo4pNwqpAyNb07OhZN9YEp56UABrImO9CQjlZqE804kL6gIdIVnlxlOAh7ZxGhvNeXFBH4Mq+zjrr5HuAxCXmGmKVDPShrcrWRxc9AcXor0pAYqrKlZgJKw8W9KsJ/o2A7sILL5y0wPvPPvsshSpIldAHLGRxXLUQx+HrbI8jcQq8x0+lRgko8/vmzZvnukTPSlXZjIVqxG1dLuh7bkQj+gmrpTMxoGvlRuhDC1HxD2tC2ZN1UwiqAK65Ea99slGbYy8dEOXt7M+DUEzVWKUSQxWVgOJ6a0JeRZiFnVEQvKpsuOGGaavWgmpVFZU3stgBylI9m6aYjM8wlik1waPaalYhKsFBSZnMOSZOgoa0myDvXDV1SmTrrbfOxgcE9isZ60BM4I45DaA0P1STLE9Ht6pba36Mg8jF4Nh9Or0mKgFrupfpiL0m/LUWr2hAAi4i3uoNSnnNMASlzNq6jZ9DjTd7QYfoeuutV5o0aZJWqsSohkK6s18tWPFuu+1WmjVrlq60+uqr58uR86effnqiX43sTELQ5iM60y/Eptrrr79+9pyoRG1NlHiygKFDqBAzGui+eCgB463ANRdiownoqwwKmJt0T52UYM1AzpkirbnMMsuUjTbaKDkPKIhLUgXiZSWv41LETU+al9GDpaKPYzaNOirLqrEmKjBFH/hA2aDgbYhIqZ/zKCFqSYh9ua56ceHNgiRGlDB1og/uoxqhEu+iiy6aYnYOegBq2rRpuhD38h1E7csvv3xWAc2YgQ4vBkCawWgJhWjHNWGnI2oC1Sfwm7I5AC5Wb1yy12gIWJu321wnYcFDDidnm222DBD10MpDUEgCgnWsR0hSNVROQKqFTjEmZwJLLrlkvkMAk/OIhZ3r/p7HhumGY4a2+tWEQLo4yZ6grQKmRPzHfeijC+EKWmUEagxGA3wWtA6LCnazO5pobksttVQ2Oz1BldimijnGe/pYc801sxlKxr0SB6Qqo44m5hcONBVrRdHQRDcVOAgyOptPmXEg6n/zzTcTfYkY6IzQHAHXUYHvo4GgUEFQHAmic845Z/aWWWaZpSyxxBJloYUWypkI8iussEIKXuV0YcgCgaAFxs1QyvDo+aogcAC6RwL0E7o82JvYEtRNIMrmfQAyxMSvPYAL0AVr8x1ngfRyyy2X9JAAihjYBKEyqLXAAgtkFVQJbapj9wlkvvnmS4GzZkFLSpLV3/gPOB1fwKhejT3uD0NpmhNpONEgJdM9WSU+ermmAYto4xZilahixqlTp04uyhEEJECV0ajYqso4R7AqAVF0QlEVci1L5TwA4FDum3322RMEvcM7gzFD5QVdvWOrUtj0Wz+/D0TjaIuL0Fcq1GB3uiBK8WLnlRlfTZXQVAXUcY6wVFEXdb+kBCwQTY690hmB4zmHUk22yLnQTx9SOQkCAoVUXZK+Q1vMMMxFv/jPC034egO/19OASkAWIsYASKKJqqCIkmtWhGiH2oILLpiNpZp57IS+6qqrZrXw3nwERchLiKAlUr1AAUBPoCHr6j10aHhUSZ1XLBgSAE0PK1/gV+/FQZ8OrNQcg4d+/1x88cWzZKyPk3AWVKhfv37yHJ/nmWeeRHzeeedN9KrkoQtFwgME9NwDcesAxPqSYyAc0N8VCBqgcwIGjusBYL6KSnb+za8SkVHjoNEkD8NJQQsEh+vWrZtBE7tFJEjIqMPn2Z7vVUYyzkPT34yA4KBonCDYWWedNV8Roa4arjVCV+JUJXS1tt6AzujHKKLiU+Kde+Hf/W0oHKdrBDOdMPFOAiyrQYMGaXVeRAiM0NAJKl5SiApduIpgUEPFqnHZg6uXEHynD9TjNK6THNQ9E+VQSHKLLLJI6ojYJRjV+DYA6f6HP7nH/N8oBH2PUnMbiAiGh6uEkqMQEbNGbb1Ro0Yp5qphuUcQdCPAalaq/lEErfQSIAgSJQBEM2hXNUPVttMOI6GNuO/+6MqNfzf4aouW3SyUP5QTeIhg7UYF/Iae4JXWfCMpvCVkx3YVhCqqqYhkgFJRhB0CZa655spOrJIVymzWdYQtkapSMSMNi1lsuT8NvtqicbUKaoyugvfuCl2t3PH888+fx+hkBDAWS5ZlohmuE7/EVAON2CgAaAey7pMUkas2StID4Ahe0qwaYEG9MTHebPmXgrf5x4ToyruFN483EnANAeO5rwVHtKhBsHRCcKrgOlwWXPXuWzmWPqEZugYIAjd9SlhF0U0/UGGakEg40IRoonv8nX+lqRslbR0PG2VRgcwxxxyZgJILQhIogcsC4e2Qrn6FMFOxY44DWbTRwQVLS1UVfA8cQBCw5AAXa42OobFNxDLLDAX/iyTqxOyxSSwyKFCpFQALxFFoo42gBYWn/vbJmZzTIwSmOo7ZMRBQkT4kQdxsWBWIGTDOBbWGxLNbzjDyv7f179+/SfSHmwOhqX5Z40wQog2TplwdV5bHMYgTmnhf/ZswW/3l+wEHIlpB67I/VWVajDS3xRtZ038c+C+3eCuqHwtfHk1mHPQrukgI0mxWMkSKAmjl0+iscmijWxuv0UYyBMxtGjZsmBSL5CfEiHzVxIkT55+pwf9yi5L+K9A5Jzr1eHSSDErpB+zTyMsOzVT4L0ADnCFMl9cH9A808UaGYm3btp0Qejkv1p65/0L/XxKpF++p+8TLTt+g1nTcF7Qg8VsfIHDd168MfjRgk4sttliKNtCfHhPmY4MHD94v1prz/xb4HyQz18iRI1v169fv9EiocwyEvcJCB4QFDg93Gh4T5YDooL0j4M49evQ4La7dwn8amRnP/jefOSaY1rULzQAAAABJRU5ErkJggg=="`;
const bunnyButt = `"data:image/svg+xml,%3Csvg width='15' height='32' viewBox='0 0 15 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9.58803 20.8649C7.72935 21.3629 8.02539 24.0334 8.76388 26.7895C9.50238 29.5456 10.5812 32.0062 12.4399 31.5082C14.2986 31.0102 15.2334 28.0099 14.4949 25.2538C13.7564 22.4978 11.4467 20.3669 9.58803 20.8649Z' fill='%230098A1'/%3E%3Cpath d='M1 24.4516C1 20.8885 3.88849 18 7.45161 18H15V28H4.54839C2.58867 28 1 26.4113 1 24.4516Z' fill='%231FC7D4'/%3E%3Cpath d='M6.11115 17.2246C6.79693 18.4124 5.77784 19.3343 4.52793 20.0559C3.27802 20.7776 1.97011 21.1992 1.28433 20.0114C0.598546 18.8236 1.1635 17.1151 2.41341 16.3935C3.66332 15.6718 5.42537 16.0368 6.11115 17.2246Z' fill='%2353DEE9'/%3E%3Cpath d='M1.64665 23.6601C0.285995 25.0207 1.87759 27.1854 3.89519 29.203C5.91279 31.2206 8.07743 32.8122 9.43808 31.4515C10.7987 30.0909 10.1082 27.0252 8.09058 25.0076C6.07298 22.99 3.0073 22.2994 1.64665 23.6601Z' fill='%231FC7D4'/%3E%3C/svg%3E"`;

const getBaseThumbStyles = ({ isMax, disabled }: StyledInputProps) => `
  -webkit-appearance: none;
  background-image: url(${isMax ? bunnyHeadMax : bunnyHeadMain});
  background-size: 24px 24px;
  background-color: transparent;
  box-shadow: none;
  border: 0;
  cursor: ${getCursorStyle};
  width: 24px;
  height: 24px;
  filter: ${disabled ? "grayscale(100%)" : "none"};
  transform: translate(-3px, 0px);
  transition: 200ms transform;
  &:hover {
    transform: ${disabled ? "scale(1)" : "scale(1.1) translate(-3px, 0px)"};
  }
`;

export const SliderLabelContainer = styled.div`
  bottom: 0;
  position: absolute;
  left: 14px;
  width: calc(100% - 30px);
`;

export const SliderLabel = styled(Text)<SliderLabelProps>`
  bottom: 0;
  font-size: 12px;
  left: ${({ progress }) => progress};
  position: absolute;
  text-align: center;
  min-width: 24px; // Slider thumb size
`;

export const BunnyButt = styled.div<DisabledProp>`
  background: url(${bunnyButt}) no-repeat;
  height: 32px;
  filter: ${({ disabled }) => (disabled ? "grayscale(100%)" : "none")};
  position: absolute;
  width: 15px;
`;

export const BunnySlider = styled.div`
  position: absolute;
  left: 0px;
  width: 100%;
`;

export const StyledInput = styled.input<StyledInputProps>`
  cursor: ${getCursorStyle};
  height: 32px;
  position: relative;
  &::-webkit-slider-thumb {
    ${getBaseThumbStyles}
  }
  &::-moz-range-thumb {
    ${getBaseThumbStyles}
  }
  &::-ms-thumb {
    ${getBaseThumbStyles}
  }
`;

export const BarBackground = styled.div<DisabledProp>`
  background-color: ${({ theme, disabled }) => theme.colors[disabled ? "textDisabled" : "inputSecondary"]};
  height: 2px;
  position: absolute;
  top: 18px;
  width: 100%;
`;

export const BarProgress = styled.div<DisabledProp>`
  background-color: ${({ theme }) => theme.colors.primary};
  filter: ${({ disabled }) => (disabled ? "grayscale(100%)" : "none")};
  height: 5px;
  position: absolute;
  top: 18px;
  transform: translate(0px, -2px);
`;
