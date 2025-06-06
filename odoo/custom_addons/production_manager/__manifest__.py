{
    'name': 'Gestion de Production',
    'description': 'Module de gestion de la production',
    'application': True,
    'author': 'Your Name',
    'website': 'Your Website',
    'category': 'Fabrication',
    'version': '1.0',
    'depends': ['base','web'],
    'data': [
        'security/ir.model.access.csv',
        'views/module_view.xml',
        'data/resource_type_data.xml',
        'views/resource_type_views.xml',
        'views/resource_views.xml',
        'data/machine_type_data.xml',
        'views/machine_type_views.xml',
        'views/machine_views.xml',
        'data/risque_type_data.xml',
        'views/risque_type_views.xml',
        'views/risque_views.xml',
        'views/commande_view.xml',
        'views/phase_production_view.xml',
        'views/equipe_view.xml',
        'views/stock_view.xml'
    ],
    'controllers':[
        'controllers/commande_controller.py'
    ]
}
