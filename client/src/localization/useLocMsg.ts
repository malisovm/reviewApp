import { useIntl } from 'react-intl'
import { enMessages } from './en'

export type LocMsgKey = keyof typeof enMessages

export default function useLocMsg() {
  const intl = useIntl()
  return (id: LocMsgKey, values?:any) => {
    return intl.formatMessage({ id: id }, values)
  }
}
