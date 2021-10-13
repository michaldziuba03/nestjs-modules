type ModuleType = 'Connection' | 'Cluster';

export class DuplicationError extends Error {
    constructor(type: ModuleType,token: string) {
        super(`${type} with name ${token} alread exists!`);
        this.name = 'DuplicationError';
        Error.captureStackTrace(this, DuplicationError);
    }
}