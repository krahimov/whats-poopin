# 💩 PoopScore - AI-Powered Health Analysis

A modern web application that analyzes poop health using AI and provides personalized dietary recommendations for both humans and dogs.

## ✨ Features

- 🔍 **AI-Powered Analysis**: Uses OpenAI's vision API to analyze poop images
- 📊 **Health Scoring**: Provides a 1-100 health score with detailed breakdown
- 🥗 **Dietary Recommendations**: Personalized suggestions to improve health
- 👤 **Multi-Species Support**: Works for both humans and dogs
- 📱 **Progressive Web App**: Install on mobile devices for quick access
- 🔐 **Secure Authentication**: Powered by Clerk for user management
- 📈 **Health Tracking**: View analysis history and track progress over time
- 🎨 **Modern UI**: Beautiful, responsive design with animations

## 🚀 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion for animations
- **Authentication**: Clerk
- **Database**: InstantDB for real-time data
- **AI**: OpenAI GPT-4 Vision API
- **Image Storage**: Cloudinary
- **UI Components**: Custom components with Radix UI primitives

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Clerk account for authentication
- OpenAI API key
- Cloudinary account for image storage
- InstantDB account

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# InstantDB
NEXT_PUBLIC_INSTANT_APP_ID=your_instant_app_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd petra
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy the environment variables above to `.env.local`
   - Fill in your actual API keys and credentials

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Keys Setup

### Clerk Authentication
1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the publishable key and secret key
4. Configure social logins if desired

### OpenAI API
1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Generate an API key from the API keys section
3. Ensure you have credits available for GPT-4 Vision API calls

### Cloudinary
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret from the dashboard
3. No additional setup required - uploads will automatically create folders

### InstantDB
1. Sign up at [instantdb.com](https://instantdb.com)
2. Create a new app
3. Copy the app ID
4. The schema is created automatically by the application

## 📱 PWA Installation

The app is a Progressive Web App (PWA) and can be installed on mobile devices:

1. **On iOS**: Open in Safari, tap the share button, then "Add to Home Screen"
2. **On Android**: Chrome will show an "Add to Home Screen" prompt
3. **On Desktop**: Look for the install icon in the address bar

## 🎯 Usage

1. **Sign up/Login**: Use the authentication system to create an account
2. **Select Type**: Choose between human or dog analysis
3. **Upload Image**: Drag and drop or click to upload a poop image
4. **Get Analysis**: AI will analyze the image and provide:
   - Health score (1-100)
   - Detailed summary
   - Health concerns (if any)
   - Dietary recommendations
   - Suggested improvements
5. **Track Progress**: View your analysis history and trends over time

## 🔒 Privacy & Security

- Images are processed securely and deleted after analysis
- All user data is encrypted and stored securely
- Authentication is handled by Clerk with industry-standard security
- API keys are kept secure on the server side
- Analysis data is private to each user account

## ⚠️ Disclaimer

This application is for informational purposes only and should not replace professional medical or veterinary advice. Always consult with healthcare professionals for serious health concerns.

## 🛣️ Future Enhancements

- [ ] Veterinary professional integration
- [ ] Sharing analysis results with healthcare providers
- [ ] Advanced health tracking and insights
- [ ] Integration with wearable devices
- [ ] Community features (anonymous)
- [ ] Multiple language support
- [ ] Advanced dietary tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the environment variables are correctly set
2. Ensure all API services are properly configured
3. Check the browser console for any error messages
4. Verify your API keys have sufficient credits/permissions

---

Built with ❤️ for better health tracking and awareness.
