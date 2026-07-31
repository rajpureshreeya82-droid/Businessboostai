# BusinessBoost AI: Developer-Optimized UI/UX Specification

This document provides a machine-actionable, code-ready specification of the **BusinessBoost AI** user interface and user experience design system . It is optimized for AI developers (such as Devin AI) to translate into frontend component hierarchies, state models, route structures, and design tokens .

---

## 🎨 1. Global Design System Tokens

### Color Palette Tokens

```css
:root {
  --color-primary: #8FBF9F;   /* Calm Sage Green */
  --color-secondary: #DCEFE3; /* Light Mint */
  --color-accent: #4F7A5A;    /* Forest Green */
  --color-bg: #F8FAF8;        /* Off White */
  --color-text: #333333;      /* Dark Gray */
}

```

* 
**Primary Color (`--color-primary`)**: `#8FBF9F` (Calm Sage Green) 


* 
**Secondary Color (`--color-secondary`)**: `#DCEFE3` (Light Mint) 


* 
**Accent Color (`--color-accent`)**: `#4F7A5A` (Forest Green) 


* 
**Background Color (`--color-bg`)**: `#F8FAF8` (Off White) 


* 
**Text Color (`--color-text`)**: `#333333` (Dark Gray) 



### Typography Tokens

* 
**Headings Font (`--font-heading`)**: `Poppins`, sans-serif (Bold) 


* 
**Body Text Font (`--font-body`)**: `Inter`, sans-serif (Regular) 


* 
**Scale**: Large readable fonts with explicit contrast against background `#F8FAF8`.



### Design Style & Layout Rules

* 
**Style**: Minimalistic with high white space utilization.


* 
**Card Radii (`--radius-card`)**: `16px` rounded cards.


* 
**Button Radii (`--radius-button`)**: `24px` rounded full-pill buttons.


* 
**Shadows (`--shadow-soft`)**: `0 4px 12px rgba(0, 0, 0, 0.04)`.


* 
**Icons**: Simple line/flat iconography.


* 
**Page Transitions**: Smooth CSS fade-in and slide transitions.


* 
**Layout Responsiveness**: Dual compatibility for mobile viewports and desktop layouts.



---

## 🗺️ 2. Master Route Hierarchy & Application Flow

The overall user journey flows sequentially through authentication, onboarding, welcoming, and the interactive dashboard :

```
[Splash Screen] -> [Login / Sign Up] -> [Business Questionnaire (New Users)] -> [Welcome Screen] -> [Home Dashboard]
                                                                                                        |
        +-----------------------+-----------------------+-----------------------+-----------------------+
        |                       |                       |                       |                       |
[Practical AI]         [Support AI]            [Calendar]         [Financial Tracker]    [Marketing Planner]

```

| Route Path | Screen Name | Access Level | Primary Layout / Component |
| --- | --- | --- | --- |
| `/` | Splash Screen | Public | <br>`SplashContainer` 

 |
| `/auth` | Login / Sign Up | Public | <br>`AuthCard` 

 |
| `/onboarding` | Business Questionnaire | Auth (New Users) | <br>`QuestionnaireWizard` 

 |
| `/welcome` | Welcome Screen | Auth | <br>`WelcomeBanner` 

 |
| `/dashboard` | Home Dashboard | Auth | <br>`MainDashboardGrid` 

 |
| `/assistant/practical` | Practical AI Assistant | Auth | <br>`ChatInterface` 

 |
| `/assistant/support` | Emotional Support AI | Auth | <br>`SupportChatInterface` 

 |
| `/calendar` | Calendar & Tasks | Auth | <br>`CalendarView` 

 |
| `/finance` | Financial Tracker | Auth | <br>`FinanceDashboard` 

 |
| `/marketing` | Marketing Planner | Auth | <br>`MarketingScheduleView` 

 |
| `/profile` | Profile & Settings | Auth | <br>`UserSettingsView` 

 |

---

## 📱 3. Screen Specifications & Structural Components

### Screen 1 – Splash Screen (`/`)

* 
**Purpose**: Initial app introduction and asset preload.


* **Components**:
* 
`Logo`: Centered BusinessBoost AI logo graphic.


* 
`AppName`: `Poppins Bold` header.


* 
`SloganText`: *"Helping Your Business Grow, One Step at a Time."* 


* 
`LoadingSpinner`: Minimalistic loading animation.




* 
**Behavior**: Auto-advances to `/auth` after exactly 2 seconds (`2000ms`).



---

### Screen 2 – Login / Sign Up (`/auth`)

* 
**Purpose**: User authentication .


* **Components & Layout**:
* 
**Top Section**: Logo display.


* 
**Center Form**: Input fields for Email (`type="email"`) and Password (`type="password"`).


* 
**Action Buttons**: Primary `Login` button and secondary `Sign Up` button.


* 
**Bottom Link**: `Forgot Password` trigger.




* **Logic**:
* Existing users submitting valid credentials route to `/welcome` or `/dashboard`.


* New users completing registration route to `/onboarding`.





---

### Screen 3 – Business Questionnaire (`/onboarding`)

* 
**Purpose**: Collect initial profile parameters to customize AI prompt context and personalization.


* **Form Sections & Data Fields**:
* **Business Information**:
* 
`Business Name` (Text Input) 


* 
`Industry` (Dropdown Select) 


* 
`Number of Employees` (Numeric Input) 


* 
`Years in Business` (Numeric Input) 




* 
**Business Goals** (Multi-select Checkboxes):


* 
`Increase Sales` 


* 
`Improve Marketing` 


* 
`Manage Finances` 


* 
`Grow Customer Base` 


* 
`Improve Organization` 




* 
**Current Challenges** (Multi-select Checkboxes):


* 
`Low Sales` 


* 
`High Expenses` 


* 
`Poor Marketing` 


* 
`Time Management` 


* 
`Customer Retention` 


* 
`Stress/Burnout` 


* 
`Inventory Problems` 


* 
`Other` 




* **Financial Information**:
* 
`Average Monthly Revenue` (Currency Input) 


* 
`Monthly Expenses` (Currency Input) 


* 
`Current Budget Goal` (Currency Input) 




* 
**Preferred AI Style** (Single-choice Radio Buttons):


* 
`Motivational` 


* 
`Professional` 


* 
`Detailed` 


* 
`Quick Answers` 






* 
**Action**: `Finish Setup` button saves options to user data store and transitions to `/welcome`.



---

### Screen 4 – Welcome Screen (`/welcome`)

* 
**Purpose**: Orientation screen presenting state-dependent summaries .


* **Conditional Rendering**:
* **Returning User View**:
* Header: *"Welcome Back, {FirstName}!"* 


* 
`TodayFocusCard`: Displays summary list:


* 
`✔ 3 Tasks Due` 


* 
`✔ Budget Updated Yesterday` 


* 
`✔ Marketing Post Tomorrow` 




* Button: `[Go to Dashboard]` (Routes to `/dashboard`).




* **New User View**:
* Header: *"Welcome to BusinessBoost AI!"* 


* Subtext: *"Your personalized business assistant is ready."* 


* Button: `[Start]` (Routes to `/dashboard`).







---

### Screen 5 – Home Dashboard (`/dashboard`)

* **Header Section**:
* Greeting: *"Good Morning, {FirstName}!"* 


* Motivational Sub-banner: *"Every small step grows your business."* 




* 
**Main Navigation Grid**: 5 prominent rounded cards in a structured layout:



```
+-----------------------------------+-----------------------------------+
|  💼 Practical AI Assistant        |  💚 Emotional Support AI          |
|  Color: Soft Green (#8FBF9F)      |  Color: Light Mint (#DCEFE3)      |
+-----------------------------------+-----------------------------------+
|  📅 Calendar                      |  📊 Financial Tracker             |
|  Color: Sage Green (#8FBF9F)      |  Color: Forest Green (#4F7A5A)    |
+-----------------------------------+-----------------------------------+
|  📣 Marketing Planner                                                 |
|  Color: Mint Green (#DCEFE3)                                          |
+-----------------------------------------------------------------------+

```

| Button / Card Name | Icon | Theme Color | Target Route & Core Capabilities |
| --- | --- | --- | --- |
| **Practical AI Assistant** | 💼 

 | Soft Green (`#8FBF9F`) 

 | <br>`/assistant/practical`: Business plans, growth strategies, action plans, goals, sales forecasts, marketing advice 

 |
| **Emotional Support AI** | 💚 

 | Light Mint (`#DCEFE3`) 

 | <br>`/assistant/support`: Stress reduction, motivation, burnout control, encouragement, confidence building 

 |
| **Calendar** | 📅 

 | Sage Green (`#8FBF9F`) 

 | <br>`/calendar`: Meetings, deadlines, appointments, AI reminders, goal target dates 

 |
| **Financial Tracker** | 📊 

 | Forest Green (`#4F7A5A`) 

 | <br>`/finance`: Income, expenses, budget, cash flow, monthly financial reports 

 |
| **Marketing Planner** | 📣 

 | Mint Green (`#DCEFE3`) 

 | <br>`/marketing`: Content recommendations, platform schedules, promo ideas, seasonal calendar 

 |

* 
**Global Bottom Navigation Bar** (Sticky across primary views):


* 
`🏠 Home` (Active) 


* 
`📊 Dashboard` 


* 
`👤 Profile` 


* 
`⚙ Settings` 





---

### Screen 6 – Practical AI Assistant (`/assistant/practical`)

* 
**Header**: Title *"Business Assistant"*.


* 
**Layout**: Conversational chat interface.


* 
`ChatHistoryArea`: Scrollable message stream displaying user inputs and AI recommendations .


* 
`QuickActionRow`: Horizontal chip row with prompt triggers:


* 
`[Create Business Plan]` 


* 
`[Analyze My Business]` 


* 
`[Marketing Ideas]` 


* 
`[Budget Advice]` 


* 
`[Growth Strategy]` 


* 
`[Sales Forecast]` 




* 
`MessageInputBox`: Text input field with direct `Send` action button.




* **Sample Operational Flow**:
* User inputs: *"Sales have decreased this month."* 


* AI response logic: Analyzes root cause, provides tactical steps, offers to update business plan, and generates explicit action items .





---

### Screen 7 – Emotional Support AI (`/assistant/support`)

* 
**Purpose**: Deliver stress management, motivation, and positive encouragement.


* **Layout & Features**:
* 
`SupportChatWindow`: Friendly chat UI tuned for empathetic responses .


* 
`StressCheckInCard`: Prompts user mood and stress score.


* 
`BreathingExerciseWidget`: Guided breathing animation component.


* 
`DailyMotivationCard`: Displays daily encouraging affirmations.


* 
`MoodTracker`: Mood tracking history log.





---

### Screen 8 – Calendar Screen (`/calendar`)

* **Components**:
* 
`MonthlyCalendarView`: Interactive month grid displaying scheduled items.


* 
`TodayScheduleList`: List item component rendering current day events.


* 
`UpcomingDeadlinesCard`: Renders task deadlines and goal target dates.


* 
`NotificationFeed`: Alert notifications list (e.g., *"Meeting 2 PM"*, *"Pay Supplier Friday"*, *"Instagram Post Tomorrow"*, *"Inventory Order Monday"*) .





---

### Screen 9 – Financial Tracker (`/finance`)

* 
**Top Summary Bar** (4 Metric Cards) :


1. 
`Monthly Revenue` 


2. 
`Monthly Expenses` 


3. 
`Profit` (`Revenue - Expenses`) 


4. 
`Budget Remaining` 




* **Data Visualization Section**:
* 
`IncomeTrendGraph`: Line/Bar chart mapping monthly income.


* 
`ExpenseTrendGraph`: Categorized breakdown of spending.




* **Action Footer**:
* 
`[Add Income]` Button 


* 
`[Add Expense]` Button 


* 
`[Generate Report]` Button 


* 
`[Ask AI for Advice]` Button 





---

### Screen 10 – Marketing Planner (`/marketing`)

* **Dashboard View**:
* 
`WeeklyPostingCalendar`: Matrix view mapping days of the week to marketing channels.


* 
*Monday*: Instagram Product Photo 


* 
*Wednesday*: Facebook Customer Review 


* 
*Friday*: TikTok Behind-the-Scenes 


* 
*Sunday*: Email Promotion 




* 
`UpcomingCampaignsList`: Active promotional campaigns.


* 
`SuggestedContentFeed`: AI generated post ideas.




* **AI Marketing Tools Panel**:
* 
`[Generate Captions]` 


* 
`[Hashtag Suggestions]` 


* 
`[Best Posting Times]` 


* 
`[Campaign Ideas]` 


* 
`[Marketing Performance Insights]` 





---

### Screen 11 – Profile & Settings (`/profile`)

* 
**Profile Tab**: Displays business profile fields (`Business Name`, `Industry`, `Business Goals`) .


* **Settings Options**:
* 
`Notification Settings` toggle controls.


* 
`Theme` selector (`Light` / `Dark` / `System`).


* 
`Language` dropdown.


* 
`Edit Business Information` modal trigger.


* 
`Logout` button.





---

## 📄 4. Data State Contracts & Interface Models

Below are the TypeScript interfaces that developers/Devin AI must implement to back the UI components.

### User Profile & Questionnaire Context

```typescript
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  isNewUser: boolean;
  businessInfo: {
    name: string;
    industry: string;
    employeeCount: number;
    yearsInBusiness: number;
  };
  goals: Array<'Increase Sales' | 'Improve Marketing' | 'Manage Finances' | 'Grow Customer Base' | 'Improve Organization'>;
  challenges: Array<'Low Sales' | 'High Expenses' | 'Poor Marketing' | 'Time Management' | 'Customer Retention' | 'Stress/Burnout' | 'Inventory Problems' | 'Other'>;
  financials: {
    monthlyRevenue: number;
    monthlyExpenses: number;
    budgetGoal: number;
  };
  aiStyle: 'Motivational' | 'Professional' | 'Detailed' | 'Quick Answers';
}

```

### Financial Summary Model

```typescript
export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string; // ISO format
  description?: string;
}

export interface FinancialSummary {
  monthlyRevenue: number;
  monthlyExpenses: number;
  profit: number;
  budgetRemaining: number;
  records: FinancialRecord[];
}

```

### Marketing Calendar Event

```typescript
export interface MarketingPost {
  id: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'Email' | 'Other';
  contentType: string;
  captionText?: string;
  hashtags?: string[];
  scheduledTime?: string;
  status: 'draft' | 'scheduled' | 'published';
}

```

---

## 💡 5. UX & Accessibility Operational Rules

1. 
**Navigation Simplicity**: Every core tool (`Practical AI`, `Emotional Support`, `Calendar`, `Financial Tracker`, `Marketing Planner`) must be accessible within **one single click/tap** from the main home dashboard (`/dashboard`) .


2. 
**Cognitive Load**: Group visual content into distinct card structures using high contrast background (`#F8FAF8`) and dark text (`#333333`).


3. 
**Real-Time Feedback**: Render explicit UI loading indicators or skeleton loaders during AI message streams, financial calculations, or report generations.


4. 
**AI Personalization Binding**: Inject the stored `UserProfile` questionnaire attributes into system prompts across both Practical and Emotional AI chat interfaces.