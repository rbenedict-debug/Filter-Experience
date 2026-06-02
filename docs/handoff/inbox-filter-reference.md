# Inbox Filters

A plain list of every filter available on the Inbox filter modal — in both **Basic** and
**Advanced** modes — plus the connectors used in Advanced.

---

## Basic filters

Filters are organized into nine categories. You can apply filters from any combination of
categories at the same time.

### Submission Date
Today · Last 7 days · Last 30 days · Last 90 days · This week · This month · Current school year · Last school year — or a custom date range.

### Ticket
- **Subject** — text search
- **Description** — text search
- **Ticket No.** — text search
- **Ticket Type** — Question · Comment · Suggestion · Concern · Compliment
- **Priority** — Critical · P1 High · P2 Normal · P3 Low
- **Status** — Unopened · In Progress · Pending Details · Closed
- **SLA** — range, 0–32 days
- **CX Score** — range, 0–10
- **Ticket Owner** — Sarah Chen · Marcus Hayes · Priya Patel · James Okonkwo · Linda Reyes · Derek Wu · Unassigned
- **Assigned Agents** — Sarah Chen · Marcus Hayes · Priya Patel · James Okonkwo · Linda Reyes · Derek Wu
- **Tags** — Escalated · Follow-up Required · After Hours · Parent Callback · Data Request · Tech Issue · Transportation · COVID-Related

### Activity
- **Last Updated** — date range
- **New Activity** — Has new activity · No new activity
- **Time in Status** — range, 0–30 days
- **Reopen Count** — range, 0–10
- **Duplicate** — Marked duplicate · Not duplicate
- **Verified** — Verified · Not verified

### Topic
- **Academics** — Grades & Report Cards · Curriculum Questions · Homework Help · Standardized Testing · Special Education
- **Enrollment & Attendance** — Enrollment Process · Withdrawal / Transfer · Attendance Questions · Tardies & Absences
- **Facilities & Safety** — Facility Concern · Safety / Bullying · Food Services · Transportation
- **Technology** — Device Issue · Login / Password Reset · App / Software Access · Wi-Fi / Connectivity

### Classification
- **Category** — General Inquiry · Technical Issue · Account & Access · Billing & Fees · Facilities & Maintenance · Safety & Conduct · Feedback & Suggestions
- **Department** — Technology · Library & Media · Food Services · Athletics · Student Activities · Transportation · Registrar · Administration
- **Ticket Theme** — Recurring Issue · Policy Clarification · Time-Sensitive · Escalation · Positive Feedback · Service Gap

### Customer
- **Customer Name** — text search
- **Customer Type** — Student · Employee · Parent / Guardian · Community Member · Other · Volunteer · Vendor · Board Member
- **Language** — Arabic · Chinese (Simplified) · English · French · Hindi · Polish · Russian · Somali · Spanish · Ukrainian · Urdu
- **Submitted By** — text search
- **Grade Level** — Pre-K · Kindergarten · Grades 1 through 12
- **Campus** — Lincoln Elementary · Central Elementary · Garfield Elementary · Washington Middle School · Roosevelt Middle School · Jefferson High School · District Office · IT Depot
- **Building** — Lincoln (Main, Annex) · Washington (Main, Gymnasium) · Jefferson (Main, STEM Wing, Arts Building) · District Administration Bldg
- **Room** — Room 101 (Kindergarten) · Room 102 (Grade 1) · Computer Lab A · Computer Lab B · STEM Lab · Science Lab · Library / Media Center · Main Office · IT Department · Conference Room A

### Asset
- **Asset Type** — Chromebook · iPad · MacBook · Windows Laptop · Desktop Computer · Monitor · Interactive Display · Projector · Printer · Graphing Calculator · Hotspot / MiFi · Headset / Headphones · Charging Cart · Barcode Scanner · Camera
- **Asset Status** — Missing · Stolen · In Transit · In Use · Available · Ready for Disposal · Disposed · Under Maintenance · Under Repair · Pending Audit · On Loan · Decommissioned
- **Loaner Issued** — Loaner issued · No loaner

### Routing
- **Entry Point** — District Website · Email · Phone · Recorder · Customer App · Text · Chatbot · Live Chat · Global Ticket · Customer Portal
- **Landing Page** — Homepage · IT Support · Human Resources · Registrar · Finance · Nutrition Services · Transportation · Communications
- **Tab** — General · Academic · IT / Tech Support · HR · Facilities · Parents

### Actions
- **Action Taken** — Phone Call · Blog Post · Email · Letter · In-Person Meeting · Newsletter · Op Ed · Speech · Other · None

> **Include or exclude:** for any filter where you pick from a list, you can flip it to
> **Exclude** to show everything that does *not* match the values you picked.

---

## Advanced filters

Advanced mode offers the **same filters as Basic** (every category and filter listed above),
with two small differences:

- **Topic** becomes one combined picker (the four categories appear as sections inside it).
- **Submission Date** is chosen as a date range rather than preset chips.

What Advanced adds on top is the ability to build logic using **connectors** and **operators**.

### Connectors (the AND / OR logic)

Connectors decide how your filters combine:

- **Match all** (AND) — a ticket must meet *every* filter.
- **Match any** (OR) — a ticket only has to meet *one*.

You set this once at the top for the whole filter. You can also add **groups** — a bundle of
filters with its own Match all / Match any setting — to build combinations like:

> **Match all:** Status is any of (Unopened, In Progress)
> **AND** (**Match any:** Priority is Critical **OR** Tags has Escalated)

Grouping goes one level deep — a group can't contain another group.

### Operators (how each filter matches its value)

- **Pick-from-list filters** (Status, Priority, Category, etc.) — *is any of* · *is none of*
- **Tags, Assigned Agents, Action Taken** (a ticket can hold several of these) — *has any of* · *has all of* · *has none of*
- **Text filters** (Subject, Description, Customer Name, etc.) — *contains* · *does not contain* · *equals* · *does not equal* · *begins with* · *ends with* · *blank* · *not blank*
- **Number ranges** (SLA, CX Score, Time in Status, Reopen Count) — *is between*
- **Dates** (Submission Date, Last Updated) — *is between*
