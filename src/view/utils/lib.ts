/**
 * 简单生成 uuid
 */
const baseTime = 1554076800000 // 减去一个基准数,获得较小时间差; 避免大整型精度问题
export const genGuid = (): string => {
  const seedT: number = (Date.now() - baseTime)
  const seedN: number = (1e4 * Math.random() | 0)
  const long: string = seedT + '' + seedN
  return (+long).toString(36)
}
