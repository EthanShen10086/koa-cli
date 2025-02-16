const { DataTypes, Model } = require('sequelize');
const sequelize = require('../plugin/dbSequelize');
class Upload extends Model {}
Upload.init(
	{
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize,
		modelName: 'Upload',
		tableName: 'upload',
		timestamps: true,
	},
);

module.exports = Upload;
