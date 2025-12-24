import { TokenGenerator, TokenBase } from 'ts-token-generator';

const tokgen = new TokenGenerator();

export function generateToken(){
    return tokgen.generate();
}