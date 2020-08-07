module.exports = {
	hrPool: {
		user: process.env.NODE_ORACLEDB_USER 
		password: process.env.NODE_ORACLEDB_PASSWORD 
		connectString: process.env.NODE_ORACLEDB_CONNECTSTRING
		poolMin: 10,
		poolMax: 10,
		poolIncrement: 0
	}
};
