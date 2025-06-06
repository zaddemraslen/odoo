from odoo import http
from odoo.http import request
import json
from datetime import datetime, date

def clean_record(record):
    if isinstance(record, dict):
        return {k: clean_record(v) for k, v in record.items()}
    elif isinstance(record, list):
        return [clean_record(item) for item in record]
    elif isinstance(record, (date, datetime)):
        return record.isoformat()
    else:
        return record

CORS_HEADERS = [
    ('Access-Control-Allow-Origin', 'http://localhost:3000'),   
    ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE'),
    ('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization'),
]

class GenericAPIController(http.Controller):

    @http.route(['/api/<path:path>'], type='http', auth='public', methods=['OPTIONS'], csrf=False)
    def handle_options(self, path, **kwargs):
        return request.make_response('', headers=CORS_HEADERS)

    def generic_get_all(self, model_name):  
        records = request.env[model_name].sudo().search([])
        data = [clean_record(rec.read()[0]) for rec in records]
        return request.make_response(json.dumps(data), headers=[('Content-Type', 'application/json')]+ CORS_HEADERS)

    def generic_get_one(self, model_name, rec_id):
        rec = request.env[model_name].sudo().browse(rec_id)
        if not rec.exists():
            return request.make_response(json.dumps({"error": f"Record with ID {rec_id} not found"}),
                                         status=404,
                                         headers=[('Content-Type', 'application/json')]  + CORS_HEADERS)
        data = clean_record(rec.read()[0])
        return request.make_response(json.dumps(data), headers=[('Content-Type', 'application/json')]+ CORS_HEADERS)

    # ------------------ Commandes ------------------
    @http.route('/api/commandes', type='http', auth='public', methods=['GET'], csrf=False)
    def get_all_commandes(self, **kwargs):

        return self.generic_get_all('production.manager.commande')

    @http.route('/api/commandes/<int:commande_id>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_commande(self, commande_id, **kwargs):
        return self.generic_get_one('production.manager.commande', commande_id)

    # ------------------ RisqueType ------------------
    @http.route('/api/risque-types', type='http', auth='public', methods=['GET'], csrf=False)
    def get_all_risque_types(self, **kwargs):
        return self.generic_get_all('production.manager.risque.type')

    @http.route('/api/risque-types/<int:rec_id>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_risque_type(self, rec_id, **kwargs):
        return self.generic_get_one('production.manager.risque.type', rec_id)

    # ------------------ Risques ------------------
    @http.route('/api/risques', type='http', auth='public', methods=['GET'], csrf=False)
    def get_all_risques(self, **kwargs):
        return self.generic_get_all('production.manager.risque')

    @http.route('/api/risques/<int:rec_id>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_risque(self, rec_id, **kwargs):
        return self.generic_get_one('production.manager.risque', rec_id)

    # ------------------ ResourceType ------------------
    @http.route('/api/resource-types', type='http', auth='public', methods=['GET'], csrf=False)
    def get_all_resource_types(self, **kwargs):
        return self.generic_get_all('production.manager.resource.type')

    @http.route('/api/resource-types/<int:rec_id>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_resource_type(self, rec_id, **kwargs):
        return self.generic_get_one('production.manager.resource.type', rec_id)

    # ------------------ Resources ------------------
    @http.route('/api/resources', type='http', auth='public', methods=['GET'], csrf=False)
    def get_all_resources(self, **kwargs):
        return self.generic_get_all('production.manager.resource')

    @http.route('/api/resources/<int:rec_id>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_resource(self, rec_id, **kwargs):
        return self.generic_get_one('production.manager.resource', rec_id)

    # ------------------ ProductionEquipe ------------------
    @http.route('/api/equipes', type='http', auth='none', methods=['GET'], csrf=False)
    def get_all_equipes(self, **kwargs):
        return self.generic_get_all('production.manager.equipe')

    @http.route('/api/equipes/<int:rec_id>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_equipe(self, rec_id, **kwargs):
        return self.generic_get_one('production.manager.equipe', rec_id)

    # ------------------ MachineType ------------------
    @http.route('/api/machine-types', type='http', auth='public', methods=['GET'], csrf=False)
    def get_all_machine_types(self, **kwargs):
        return self.generic_get_all('production.manager.machine.type')

    @http.route('/api/machine-types/<int:rec_id>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_machine_type(self, rec_id, **kwargs):
        return self.generic_get_one('production.manager.machine.type', rec_id)

    # ------------------ Machines ------------------
    @http.route('/api/machines', type='http', auth='public', methods=['GET'], csrf=False)
    def get_all_machines(self, **kwargs):
        return self.generic_get_all('production.manager.machine')

    @http.route('/api/machines/<int:rec_id>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_machine(self, rec_id, **kwargs):
        return self.generic_get_one('production.manager.machine', rec_id)

    # ------------------ ProductionPhase ------------------
    @http.route('/api/phases', type='http', auth='public', methods=['GET'], csrf=False)
    def get_all_phases(self, **kwargs):
        return self.generic_get_all('production.manager.phase')

    @http.route('/api/phases/<int:rec_id>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_phase(self, rec_id, **kwargs):
        return self.generic_get_one('production.manager.phase', rec_id)

    # ------------------ ProductionStock ------------------
    @http.route('/api/stocks', type='http', auth='public', methods=['GET'], csrf=False)
    def get_all_stocks(self, **kwargs):
        return self.generic_get_all('production.manager.stock')

    @http.route('/api/stocks/<int:rec_id>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_stock(self, rec_id, **kwargs):
        return self.generic_get_one('production.manager.stock', rec_id)


class CommandeAPIController(http.Controller):

    @http.route('/api/commandes/filter/without-production', type='http', auth='public', methods=['GET'], csrf=False)
    def get_commandes_without_production(self, **kwargs):
        commandes = request.env['production.manager.commande'].sudo().search([
            ('production_ids', '=', False)
        ])
        raw_data = [commande.read()[0] for commande in commandes]

        data = [clean_record(r) for r in raw_data]

        return request.make_response(
            json.dumps(data),
            headers=[('Content-Type', 'application/json')]+ CORS_HEADERS
        )


class ProductionAPIController(http.Controller):

    def add_commande_details(self, production_record):
        commande = production_record.get('commande_id')
        if commande:
            commande_id = commande[0]
            commande_record = request.env['production.manager.commande'].sudo().browse(commande_id)
            if commande_record.exists():
                commande_data = commande_record.read()[0]
                production_record['commande_details'] = clean_record(commande_data)
        return production_record

    @http.route('/api/productions/flat', type='http', auth='public', methods=['GET'], csrf=False)
    def get_all_productions_flat(self, **kwargs):
        productions = request.env['production.manager.production'].sudo().search([])
        raw_data = [p.read()[0] for p in productions]
        data = [clean_record(p) for p in raw_data]
        return request.make_response(json.dumps(data), headers=[('Content-Type', 'application/json')]+ CORS_HEADERS)

    @http.route('/api/productions/flat/<int:production_id>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_production_by_id_flat(self, production_id, **kwargs):
        production = request.env['production.manager.production'].sudo().browse(production_id)
        if not production.exists():
            return request.make_response(
                json.dumps({"error": f"Production with ID {production_id} not found"}),
                status=404,
                headers=[('Content-Type', 'application/json')]+ CORS_HEADERS
            )
        raw_data = production.read()[0]
        data = clean_record(raw_data)
        return request.make_response(json.dumps(data), headers=[('Content-Type', 'application/json')]+ CORS_HEADERS)


    @http.route('/api/productions', type='http', auth='public', methods=['GET'], csrf=False)
    def get_all_productions_detailed(self, **kwargs):
        productions = request.env['production.manager.production'].sudo().search([])
        raw_data = [clean_record(p.read()[0]) for p in productions]
        enriched = [self.add_commande_details(p) for p in raw_data]
        return request.make_response(json.dumps(enriched), headers=[('Content-Type', 'application/json')]+ CORS_HEADERS)

    @http.route('/api/productions/<int:production_id>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_production_by_id_detailed(self, production_id, **kwargs):
        production = request.env['production.manager.production'].sudo().browse(production_id)
        if not production.exists():
            return request.make_response(
                json.dumps({"error": f"Production with ID {production_id} not found"}),
                status=404,
                headers=[('Content-Type', 'application/json')]+ CORS_HEADERS
            )
        raw_data = clean_record(production.read()[0])
        enriched = self.add_commande_details(raw_data)
        return request.make_response(json.dumps(enriched), headers=[('Content-Type', 'application/json')]+ CORS_HEADERS)

    @http.route('/api/productions/by_commande/flat/<int:commande_id>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_productions_by_commande_flat(self, commande_id, **kwargs):
        productions = request.env['production.manager.production'].sudo().search([
            ('commande_id', '=', commande_id)
        ])
        raw_data = [p.read()[0] for p in productions]
        data = [clean_record(p) for p in raw_data]
        return request.make_response(json.dumps(data), headers=[('Content-Type', 'application/json')]+ CORS_HEADERS)

    @http.route('/api/productions/by_commande/<int:commande_id>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_productions_by_commande_detailed(self, commande_id, **kwargs):
        productions = request.env['production.manager.production'].sudo().search([
            ('commande_id', '=', commande_id)
        ])
        raw_data = [clean_record(p.read()[0]) for p in productions]
        enriched = [self.add_commande_details(p) for p in raw_data]
        return request.make_response(json.dumps(enriched), headers=[('Content-Type', 'application/json')]+ CORS_HEADERS)



