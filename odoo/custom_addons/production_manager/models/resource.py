from odoo import models, fields, api

class ResourceType(models.Model):
    _name = 'production.manager.resource.type'
    _description = 'Type de Ressource'

    name = fields.Char(string='Nom du Type de Ressource', required=True)
    create_date = fields.Datetime(string='Date de Création', readonly=True)
    write_date = fields.Datetime(string='Dernière Mise à Jour', readonly=True)


class Resource(models.Model):
    _name = 'production.manager.resource'
    _description = 'Ressource'

    name = fields.Char(string='Nom de la Ressource', required=True)
    type_id = fields.Many2one('production.manager.resource.type', string='Type de Ressource')
    stock = fields.Integer(string='Stock Disponible')
    create_date = fields.Datetime(string='Date de Création', readonly=True)
    write_date = fields.Datetime(string='Dernière Mise à Jour', readonly=True)


