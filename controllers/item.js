const ItemService = require('../services/item');

class ItemController {
    async create(req, res) {
        try {
            const result = await ItemService.create(req.user.id, req.body);
            res.status(200).json(result);
        }
        catch(e) {
            res.status(422).json(e);
        }
    }

    async getList(req, res) {
        try {
            const result = await ItemService.getList();
            res.status(200).json(result);
        }
        catch(e) {
            res.status(400).json(e);
        }
    }

    async getById(req, res) {
        try {
            const result = await ItemService.getById(req.params.id);
            res.status(200).json(result);
        }
        catch(e) {
            res.status(404).json(undefined);
        }
    }

    async update(req, res) {
        try {
            const result = await ItemService.update(req.params.id, req.user.id, req.body);
            res.status(200).json(result);
        }
        catch(e) {
            if(e.status){
                res.status(e.status).json(e.message);
            }
            else{
                res.status(400).json(undefined);
            }
        }
    }

    async delete(req, res) {
        try {
            res.status(200).json(await ItemService.delete(req.params.id, req.user.id));
        }
        catch(e) {
            if(e.status){
                res.status(e.status).json(e.message);
            }
            else{
                res.status(500).json(undefined);
            }
        }
    }

    async verifyAccess(req, res, next) {
        try {
            if(await ItemService.verifyAccess(req.params.id, req.user.id)) next();
        }
        catch (e) {
            if(e.status){
                res.status(e.status).json(e.message);
            }
            else{
                res.status(500).json(undefined);
            }
        }
    }

    async saveImage(req, res) {
        try {
            res.status(200).send(await ItemService.saveFile(req.params.id, req.file));
        }
        catch (e) {
            res.status(422).json(e);
        }
    }

    async handleErrorUploadItemImage(err, req, res, _) {
        try {
            await ItemService.handleErrorUploadImage(err);
        }
        catch(e) {
            res.status(422).json(e);
        }
    }
}

module.exports = new ItemController();
