import {
  COLUMN_KEY_ADDRESS,
  COLUMN_KEY_CHECK,
  COLUMN_KEY_EMAIL_AGREEMENT,
  COLUMN_KEY_JOB,
  COLUMN_KEY_MEMO,
  COLUMN_KEY_NAME,
  COLUMN_KEY_REGISTER_DATE,
  COLUMN_KEY_SETTINGS,
} from '../configs/columnMetadata'
import { TableRow } from '../models/entities'

// 랜덤한 문자열 생성 함수 (예제)
function getRandomString(length: number = 5): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < length; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 랜덤한 날짜(UTC타임스탬프) 문자열 생성
function getRandomDate(): string {
  const start = new Date(2020, 0, 1).getTime()
  const end = new Date().getTime()
  const randomTime = Math.floor(Math.random() * (end - start)) + start
  return randomTime.toString()
}

// 직업 옵션
const JOB_OPTIONS = ['개발자', 'PO', '기획자']

// 랜덤한 레코드 생성 함수
export function createRandomRecord(): TableRow['record'] {
  return {
    [COLUMN_KEY_CHECK]: Math.random() < 0.5,
    [COLUMN_KEY_NAME]: getRandomString(8),
    [COLUMN_KEY_ADDRESS]: `Address-${getRandomString(10)}`,
    [COLUMN_KEY_MEMO]: `Memo-${getRandomString(15)}`,
    [COLUMN_KEY_REGISTER_DATE]: getRandomDate(),
    [COLUMN_KEY_JOB]: JOB_OPTIONS[Math.floor(Math.random() * JOB_OPTIONS.length)],
    [COLUMN_KEY_EMAIL_AGREEMENT]: Math.random() < 0.5,
  }
}
