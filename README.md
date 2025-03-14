# Fair Share Coupon Distribution System

A web application that distributes coupons to users in a round-robin fashion while preventing abuse through browser fingerprinting and cooldown periods.

## Overview

This system provides a fair approach to coupon distribution by:
- Sequentially distributing coupons (round-robin)
- Preventing abuse with browser fingerprinting
- Implementing cooldown periods between claims
- Providing a clean, responsive user interface
- Requiring no account creation

## Features

- **Fair Distribution**: Users receive the next coupon in sequence
- **Guest Access**: No registration required to claim coupons
- **Abuse Prevention**: Multiple layers of protection against multiple claims
- **Responsive Design**: Works on all device sizes
- **Clear Feedback**: Immediate status updates and cooldown information

## Setup Instructions

1. **Clone the Repository**



Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Technical Implementation

- **Frontend**: React.js with Tailwind CSS
- **State Management**: React state and context
- **Storage**: Browser cookies and localStorage
- **Security**: Client-side fingerprinting and verification
