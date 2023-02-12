import { faker } from '@faker-js/faker'

export const Person = {
  firstName: string,
  lastName: string,
  age: number,
  visits: number,
  progress: number,
  status: 'relationship' | 'complicated' | 'single',
  subRows: Person
}

const range = () => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    age: faker.datatype.number(40),
    visits: faker.datatype.number(1000),
    progress: faker.datatype.number(100),
    status: faker.helpers.shuffle([
      'relationship',
      'complicated',
      'single',
    ])[0],
  }
}

export function makeData (...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map((d) => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
