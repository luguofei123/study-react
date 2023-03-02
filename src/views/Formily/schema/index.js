import basic from './basic'
import param from './param'
import element from './element'
const schema = {
    type: 'object',
    properties: {
        collapse: {
            type: 'void',
            'x-component': 'FormTab',
            'x-component-props': {
            },
            properties: {
                basic,
                param,
                element
            },
        },
    },
}

export default schema