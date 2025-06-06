from odoo import models, fields, api

class RisqueType(models.Model):
    _name = 'production.manager.risque.type'
    _description = 'Type de Risque'

    name = fields.Char(string='Type de Risque', required=True)
    create_date = fields.Datetime(string='Date de Création', readonly=True)
    write_date = fields.Datetime(string='Dernière Mise à Jour', readonly=True)


class Risque(models.Model):
    _name = 'production.manager.risque'
    _description = 'Risque'

    type_id = fields.Many2one('production.manager.risque.type', string='Type de Risque', required=True)
    gravite = fields.Selection([
        ('faible', 'Faible'),
        ('moyenne', 'Moyenne'),
        ('elevee', 'Élevée'),
    ], string='Gravité', required=True)

    impact = fields.Selection([
        ('faible', 'Faible'),
        ('modere', 'Modéré'),
        ('critique', 'Critique'),
    ], string='Impact', required=True)

    mesures_prises = fields.Text(string='Mesures Prises')
    create_date = fields.Datetime(string='Date de Création', readonly=True)
    write_date = fields.Datetime(string='Dernière Mise à Jour', readonly=True)
