import {randomBytes,scryptSync} from 'node:crypto';
import {createInterface} from 'node:readline/promises';
import {Writable} from 'node:stream';
const output=new Writable({write(chunk,encoding,callback){callback()}});
const rl=createInterface({input:process.stdin,output,terminal:true});
process.stdout.write('Enter a strong admin password (input hidden): ');
const password=await rl.question('');rl.close();process.stdout.write('\n');
if(password.length<14)throw Error('Use at least 14 characters.');
const salt=randomBytes(16).toString('hex');console.log(salt+':'+scryptSync(password,salt,64).toString('hex'));
