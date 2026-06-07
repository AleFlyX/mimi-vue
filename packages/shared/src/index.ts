export function isObject(val){
    return val !== null && typeof val === 'object';
}
isObject({'abd':123});