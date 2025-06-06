from odoo import models, fields

class Commande(models.Model):
    _name = 'production.manager.commande'
    _description = 'Commande'

    client = fields.Char(string='Client', required=True)
    produit_commande = fields.Char(string='Produit Commandé', required=True)
    quantite = fields.Integer(string='Quantité', required=True)
    statut = fields.Selection([
        ('en_attente', 'En attente'),
        ('en_production', 'En production'),
        ('livree', 'Livrée')
    ], string='Statut', default='en_attente')
    date_commande = fields.Date(string='Date de la Commande', required=True)

    production_ids = fields.One2many(
        'production.manager.production',
        'commande_id',
        string='Productions'
    )

    create_date = fields.Datetime(string='Date de Création', readonly=True)
    write_date = fields.Datetime(string='Date de Modification', readonly=True)


class Production(models.Model):
    _name = 'production.manager.production'
    _description = 'Production'

    date_production = fields.Datetime(string='Date de Production', default=fields.Datetime.now)
    commande_id = fields.Many2one(
        'production.manager.commande',
        string='Commande',
        required=True
    )
    produit = fields.Char(string='Produit', required=True)
    quantite = fields.Integer(string='Quantité', required=True)
    statut = fields.Selection([
        ('en_cours', 'En cours'),
        ('en_attente', 'En attente'),
        ('termine', 'Terminé')
    ], string='Statut', default='en_attente')
    prix_unitaire = fields.Float(string='Prix Unitaire', required=True)
    cout_production = fields.Float(string='Coût de Production', required=True)
    temps_production = fields.Float(string='Temps de Production (heures)', required=True)

    create_date = fields.Datetime(string='Date de Création', readonly=True)
    write_date = fields.Datetime(string='Date de Modification', readonly=True)

class ProductionPhase(models.Model):
    _name = 'production.manager.phase'
    _description = 'Phase de Production'

    name = fields.Char(string='Nom de la Phase', required=True)
    duree = fields.Float(string='Durée (h)', required=True)
    responsable = fields.Char(string='Responsable', required=True)

    create_date = fields.Datetime(string='Date de Création', readonly=True)
    write_date = fields.Datetime(string='Dernière Mise à Jour', readonly=True)


class ProductionStock(models.Model):
    _name = 'production.manager.stock'
    _description = 'Stock de Production'

    produit = fields.Char(string='Produit', required=True)
    quantite_disponible = fields.Integer(string='Quantité Disponible')
    lieu_stockage = fields.Char(string='Lieu de Stockage')
    type_matiere = fields.Char(string='Type de Matière')

    create_date = fields.Datetime(string='Date de Création', readonly=True)
    write_date = fields.Datetime(string='Dernière Mise à Jour', readonly=True)
