import { useIntl } from 'react-intl'
import { enMessages } from './en'

export type LocMsgKey = keyof typeof enMessages

export default function useLocMsg() {
  const intl = useIntl()
  return (id: LocMsgKey, variables?: any) => intl.formatMessage({ id: id }, variables)
}