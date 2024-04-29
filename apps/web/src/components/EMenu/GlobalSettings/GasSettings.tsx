import { Flex, Button, Text, QuestionHelper } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useGasPriceManager } from 'state/user/hooks'
import { GAS_PRICE_GWEI, GAS_PRICE } from 'state/types'
import EButtonSm from 'components/EButtonSm'

const GasSettings = () => {
  const { t } = useTranslation()
  const [gasPrice, setGasPrice] = useGasPriceManager()

  return (
    <Flex flexDirection="column">
      <Flex mb="12px" alignItems="center">
        <Text>{t('default transaction speed (gwei)')}</Text>
      </Flex>
      <Flex flexWrap="wrap" style={{ gap: 8 }}>
        <EButtonSm
          style={{ width: '120px', textAlign: 'center' }}
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.rpcDefault)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.rpcDefault ? 'primary' : 'tertiary'}
        >
          {t('DEFAULT')}
        </EButtonSm>
        <EButtonSm
          style={{ width: '120px', textAlign: 'center' }}
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.default)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.default ? 'primary' : 'tertiary'}
        >
          {t('STANDARD')}
        </EButtonSm>
        <EButtonSm
          style={{ width: '120px', textAlign: 'center' }}
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.fast)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.fast ? 'primary' : 'tertiary'}
        >
          {t('FAST')}
        </EButtonSm>
        <EButtonSm
          style={{ width: '120px', textAlign: 'center' }}
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.instant)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.instant ? 'primary' : 'tertiary'}
        >
          {t('INSTANT')}
        </EButtonSm>
      </Flex>
    </Flex>
  )
}

export default GasSettings
