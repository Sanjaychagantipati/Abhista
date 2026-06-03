# DATABASE_SCHEMA.md

## ROLE

id
role_name
description
created_at

---

## USER

id
first_name
last_name
email
password
phone
role_id
profile_image_url
address
city
state
status
created_at
updated_at

---

## CONTRACTOR_PROFILE

id
user_id
company_name
experience_years
business_description
verification_status
rating_average
total_projects
created_at

---

## WORKER_PROFILE

id
user_id
contractor_id
skill_type
experience_years
availability_status
created_at

---

## ARCHITECT_PROFILE

id
user_id
specialization
experience_years
portfolio_url
verification_status
created_at

---

## REQUIREMENT

id
customer_id
title
description
service_category
location
budget_min
budget_max
preferred_start_date
status
created_at

---

## PROJECT

id
requirement_id
customer_id
contractor_id
architect_id
title
description
estimated_budget
current_spend
progress_percentage
start_date
expected_end_date
status
created_at

---

## MILESTONE

id
project_id
title
description
target_date
completed_date
status
completion_percentage
created_at

---

## TASK

id
project_id
milestone_id
assigned_worker_id
title
description
priority
status
due_date
created_at

---

## PROJECT_ASSIGNMENT

id
project_id
worker_id
assigned_by
assigned_date
status

---

## CONVERSATION

id
project_id
created_at

---

## MESSAGE

id
conversation_id
sender_id
receiver_id
message_text
attachment_url
is_read
sent_at

---

## NOTIFICATION

id
user_id
title
message
type
is_read
created_at

---

## REVIEW

id
project_id
customer_id
contractor_id
rating_value
review_text
created_at

---

## PROJECT_FILE

id
project_id
uploaded_by
milestone_id
file_name
file_url
file_type
caption
created_at
