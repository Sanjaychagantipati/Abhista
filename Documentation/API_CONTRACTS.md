API_CONTRACTS.md

================================================

POST /api/requirements

Request

{
"title": "",
"description": "",
"location": "",
"budgetMin": 0,
"budgetMax": 0
}

Response

{
"id": 1,
"status": "OPEN",
"message": "Requirement Created Successfully"
}

Status Codes

201 Created

400 Validation Error

401 Unauthorized

403 Forbidden

================================================

GET /api/requirements/my

Response

[
{
"id":1,
"title":"Requirement"
}
]

================================================

GET /api/requirements/{id}

Response

{
"id":1,
"title":"Requirement"
}
