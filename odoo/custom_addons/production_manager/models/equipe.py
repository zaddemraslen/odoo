from odoo import models, fields


class ProductionEquipe(models.Model):
    _name = 'production.manager.equipe'
    _description = 'Équipe de Production'

    name = fields.Char(string='Nom de l’Équipe', required=True)
    chef_equipe = fields.Char(string='Chef d’Équipe', required=True)
    effectif = fields.Integer(string='Effectif', required=True)
    heures_travaillees = fields.Float(string='Nombre d’Heures Travaillées')
    disponibilite = fields.Selection([
        ('disponible', 'Disponible'),
        ('occupee', 'Occupée'),
        ('partielle', 'Partielle')
    ], string='Disponibilité', default='disponible')

    create_date = fields.Datetime(string='Date de Création', readonly=True)
    write_date = fields.Datetime(string='Dernière Mise à Jour', readonly=True)
