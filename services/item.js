const { User, Item } = require('../models');
const multer = require('multer');

class ItemService {
    async create(idUser, data) {
        const errors = [];

        if(!data) {
            errors.push({
                field: 'data',
                message: 'Empty data.'
            });

            throw errors;
        }

        const { title, price } = data;

        if(title) {
            if(title.length < 3) {
                errors.push({
                    field: 'title',
                    message: 'Title should contain at least 3 characters.'
                });
            }
        }
        else{
            errors.push({
                field: 'title',
                message: 'Title of required.'
            });
        }

        if(price) {
            if(price < 0.01) {
                errors.push({
                    field: 'price',
                    message: 'Minimum price 0.01.'
                });
            }
        }
        else{
            errors.push({
                field: 'price',
                message: 'Price of required.'
            });
        }

        if(errors.length !== 0) throw errors;

        const user = await User.findByPk(idUser);
        const item = await user.createItem({ title, price });

        return {
            id: item.id,
            created_at: item.createdAt,
            title: item.title,
            price: item.price,
            image: item.image,
            user_id: item.userId,
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
                email: user.email
            }
        };
    }

    async getList() {
        const result = [];
        const items = await Item.findAll({
            include: User
        });

        items.forEach(item => result.push({
            id: item.id,
            created_at: item.createdAt,
            title: item.title,
            price: item.price,
            image: item.image,
            user_id: item.userId,
            user: {
                id: item.user.id,
                phone: item.user.phone,
                name: item.user.name,
                email: item.user.email
            }
        }));

        return result;
    }

    async getById(id) {
        const item = await Item.findByPk(id, {
            include: User
        });

        if(!item) {
            throw {}
        }

        return {
            id: item.id,
            created_at: item.createdAt,
            title: item.title,
            price: item.price,
            image: item.image,
            user_id: item.userId,
            user: {
                id: item.user.id,
                phone: item.user.phone,
                name: item.user.name,
                email: item.user.email
            }
        };
    }

    async update(id, idUser, data) {
        const errors = {
            status: 422,
            message: []
        };

        if(!data) {
            errors.message.push({
                field: 'data',
                message: 'Empty data.'
            });

            throw errors;
        }

        const { title, price } = data;

        if(title) {
            if(title.length < 3) {
                errors.message.push({
                    field: 'title',
                    message: 'Title should contain at least 3 characters.'
                });
            }
        }

        if(price) {
            if(price < 0.01) {
                errors.message.push({
                    field: 'price',
                    message: 'Minimum price 0.01.'
                });
            }
        }

        if(errors.message.length !== 0) throw errors;

        await Item.update({ title, price }, {
            where: {
                id
            }
        });

        const updateItem = await Item.findByPk(id, {
            include: User
        });

        return {
            id: updateItem.id,
            created_at: updateItem.createdAt,
            title: updateItem.title,
            price: updateItem.price,
            image: updateItem.image,
            user_id: updateItem.userId,
            user: {
                id: updateItem.user.id,
                phone: updateItem.user.phone,
                name: updateItem.user.name,
                email: updateItem.user.email
            }
        };
    }

    async delete(id) {
        await Item.destroy({
            where: {
                id
            }
        });

        return undefined;
    }

    async verifyAccess(id, idUser) {
        const item = await Item.findByPk(id, {
            include: User
        });

        if(!item) {
            throw {
                status: 404,
                message: undefined
            };
        }

        if(item.userId !== idUser) {
            throw {
                status: 403,
                message: undefined
            };
        }

        return true;
    }

    async saveFile(id, file) {
        if(!file) {
            throw [
                {
                    field: 'image',
                    message: `Empty file`
                }
            ];
        }

        await Item.update({ image: "/static/" + file.filename }, {
            where: {
                id
            }
        });

        const updateItem = await Item.findByPk(id, {
            include: User
        });

        return {
            id: updateItem.id,
            created_at: updateItem.createdAt,
            title: updateItem.title,
            price: updateItem.price,
            image: updateItem.image,
            user_id: updateItem.userId,
            user: {
                id: updateItem.user.id,
                phone: updateItem.user.phone,
                name: updateItem.user.name,
                email: updateItem.user.email
            }
        };
    }

    async handleErrorUploadImage(err) {
        if(err instanceof multer.MulterError) {
            switch(err.code) {
                case 'ERROR_FORMAT':
                    throw [
                        {
                            field: 'image',
                            message: `The file isn't image.`
                        }
                    ];
                case 'LIMIT_FILE_SIZE':
                    throw [
                        {
                            field: 'image',
                            message: `The file is too big.`
                        }
                    ];
            }
        }

        return true;
    }
}

module.exports = new ItemService();
