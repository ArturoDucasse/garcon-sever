const PORT = 3000;
export const environment = {
  development: {
    serverURL: `http://localhost:${PORT}/`,
    dbString: "mongodb://localhost:3001/graphqlTutorial"
  },
  production: {
    serverURL: `http://localhost:${PORT}/`,
    dbString: "mongodb://localhost:3001/graphqlTutorial-prod"
  }
};

export default PORT;
