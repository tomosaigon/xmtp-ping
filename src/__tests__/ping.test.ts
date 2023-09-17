import { exec, ExecException } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('Test ping command', () => {
    it('should run start, output includes "PING," "gm," and "Shutting down"', async () => {
        const tempOutputFile = path.join(__dirname, 'temp-output.txt');
        const command = 'npm run start';

        await new Promise((resolve: (value: void | PromiseLike<void>) => void, reject) => {
            const childProcess = exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
                if (error) {
                    reject(error);
                    return;
                }
                fs.writeFileSync(tempOutputFile, stdout, 'utf-8');
                resolve();
            });
            setTimeout(() => {
                childProcess.stdin?.write('exit\n');
                setTimeout(() => {
                    childProcess.stdin?.end();
                }, 100);
            }, 10000);
        });

        const outputContent = fs.readFileSync(tempOutputFile, 'utf-8');
        expect(outputContent).toContain('PING');
        expect(outputContent).toContain('gm');
        const lines = outputContent.split('\n');
        console.log(lines);
        const lastLine = lines[lines.length - 2].trim();
        expect(lastLine).toEqual('Shutting down');

        fs.unlinkSync(tempOutputFile);
    }, 20000);
});
