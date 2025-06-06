from odoo import models, fields

class MachineType(models.Model):
    _name = 'production.manager.machine.type'
    _description = 'Type de Machine'

    name = fields.Char(string='Nom du Type', required=True)
    create_date = fields.Datetime(string='Date de Création', readonly=True)
    write_date = fields.Datetime(string='Dernière Mise à Jour', readonly=True)



class Machine(models.Model):
    _name = 'production.manager.machine'
    _description = 'Machine'

    name = fields.Char(string='Nom de la Machine', required=True)
    last_maintenance_date = fields.Date(string='Dernière Date de Maintenance')
    next_maintenance_date = fields.Date(string='Prochaine Maintenance')
    status = fields.Selection([
        ('operational', 'En service'),
        ('maintenance', 'En Maintenance'),
        ('out_of_service', 'Hors Service')
    ], string='Statut', default='operational')
    type_id = fields.Many2one('production.manager.machine.type', string='Type de Machine',
                               required=True, ondelete='restrict')
    create_date = fields.Datetime(string='Date de Création', readonly=True)
    write_date = fields.Datetime(string='Dernière Mise à Jour', readonly=True)
