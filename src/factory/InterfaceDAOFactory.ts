export interface InterfaceDAOFactory {
    // TODO create de cada modelo de BD
    closeConnection: () => Promise<void>
}