import { InterfaceDAOFactory } from '../../src/factory/InterfaceDAOFactory'

declare global {
    namespace Express {
        interface Request {
            db?: InterfaceDAOFactory
        }
    }
}