# Software Requirement Specification (SRS)

## LPG Commercial Cylinder Monitoring System

------------------------------------------------------------------------

# 1. Introduction

## 1.1 Purpose

The purpose of this system is to monitor the availability and
distribution of commercial LPG cylinders during periods of scarcity and
ensure that urgent requirements from essential sectors are addressed in
a structured and transparent manner.

The system enables commercial customers to raise SOS requests, which are
processed through the supply department hierarchy and acted upon by Oil
Marketing Companies (OMCs).

## 1.2 Scope

The system will facilitate:

-   Submission of SOS requests by commercial LPG consumers
-   Scrutiny of requests by Taluk and District Supply Officers
-   Approval or rejection by the Commissioner
-   Action and status updates by Oil Marketing Companies
-   Daily reporting of cylinder stock and distribution by OMCs
-   A centralized dashboard displaying key statistics and request status

------------------------------------------------------------------------

# 2. System Users

The system will have **five categories of users**.

## 2.1 Commercial Customers

Commercial LPG consumers who are facing shortage of cylinders can submit
**SOS requests** through the system.

Permissions: - Submit SOS request - View status of submitted requests

------------------------------------------------------------------------

## 2.2 Taluk Supply Officers

Each Taluk will have **one Taluk Supply Officer**.

Permissions: - View SOS requests related to their jurisdiction - Reject
a request - Forward a request to the Commissioner

------------------------------------------------------------------------

## 2.3 District Supply Officers

Each District will have **one District Supply Officer**.

Permissions: - View SOS requests related to their district - Reject a
request - Forward a request to the Commissioner

Either the **Taluk Supply Officer or the District Supply Officer** may
process the request.

------------------------------------------------------------------------

## 2.4 Commissioner

There will be **one Commissioner for the entire state**.

Permissions: - View forwarded SOS requests - Reject requests - Approve
requests

Approved requests will become visible to Oil Marketing Companies.

------------------------------------------------------------------------

## 2.5 Oil Marketing Companies (OMCs)

Oil Marketing Companies will handle approved SOS requests and update the
status after taking action.

Permissions: - View approved SOS requests - Update request status -
Upload daily cylinder distribution report

Available request status options for OMC:

-   In Progress
-   Completed

------------------------------------------------------------------------

# 3. SOS Request Workflow

### Step 1 -- SOS Request Submission

A commercial customer submits an SOS request through the system.

The request is automatically mapped to the relevant: - Taluk Supply
Officer - District Supply Officer

------------------------------------------------------------------------

### Step 2 -- Initial Scrutiny

Both officers can view the request.

Either officer can:

-   Reject the request
-   Forward the request to the Commissioner

If rejected, the request status becomes **Rejected**.

If forwarded, the request moves to the Commissioner.

------------------------------------------------------------------------

### Step 3 -- Commissioner Decision

The Commissioner reviews the request and can:

-   Reject the request
-   Approve the request

If approved, the request becomes visible to Oil Marketing Companies.

------------------------------------------------------------------------

### Step 4 -- Action by Oil Marketing Companies

Oil Marketing Companies can view all **approved SOS requests**.

They will:

-   Take action to supply cylinders
-   Update the request status as:
-   In Progress
-   Completed

------------------------------------------------------------------------

# 4. Daily Stock Reporting by Oil Marketing Companies

Each Oil Marketing Company must upload a **daily Excel report**
containing:

-   Number of LPG cylinders distributed on the previous day
-   Current balance of LPG cylinders in their warehouse

The system will process and store this information for monitoring and
dashboard display.

------------------------------------------------------------------------

# 5. Dashboard

The system will provide a **common dashboard** displaying key
operational metrics.

The dashboard may include:

-   Total SOS requests submitted
-   Requests pending with officers
-   Requests approved by Commissioner
-   Requests rejected
-   Requests in progress
-   Requests completed
-   Daily cylinder distribution statistics
-   Current stock availability reported by OMCs

------------------------------------------------------------------------

# 6. Request Status Values

The SOS request can have the following statuses:

-   Submitted
-   Rejected by Taluk/District Officer
-   Forwarded to Commissioner
-   Rejected by Commissioner
-   Approved
-   Delivery In Progress
-   Completed

------------------------------------------------------------------------

# 7. Constraints

-   There will be **one Taluk Supply Officer per Taluk**.
-   There will be **one District Supply Officer per District**.
-   There will be **only one Commissioner for the entire state**.
-   Notifications (SMS, Email, System alerts) are **not included in the
    current phase**.

------------------------------------------------------------------------

# 8. Data Inputs

## SOS Request

Fields may include:

-   Customer Name
-   Organization / Establishment Name
-   Contact Number
-   Location (Taluk, District)
-   Number of cylinders required
-   Reason for SOS request
-   Date and time of request

------------------------------------------------------------------------

## Daily OMC Report Upload

Excel file containing:

-   OMC Name
-   Date
-   Cylinders Produced
-   Cylinders distributed
-   Current warehouse balance

------------------------------------------------------------------------

# 9. Audit and Tracking

The system must record:

-   Who processed the request
-   Action taken
-   Date and time of action
-   Current status of request
