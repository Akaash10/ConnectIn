import { useState, useEffect } from "react";
import ViewPost from "../ViewPost/ViewPost";
import "./PostList.css";

// All data coming from variables (will be replaced by API calls)
const staticPosts = [
  {
    id: 1,
    authorId: 101,
    author: "Sri Shakthi Institute of Engineering and Technology",
    authorAvatar: null,
    headline: "Higher Education Institution",
    timeAgo: "3h",
    description:
      "Sri Shakthi Institute of Engineering and Technology, Coimbatore, was delighted to host a Guest Lecture on Product Leadership and Impact at SIET Auditorium on 26th December, Friday at 10:30 AM. The session was led by Dheepan Thangavelu, Founder of Athen & LeapProd.ai, and covered AI-Product Development and Growth Mindset.\n\nThe event was organized by the Department of Information Technology and witnessed active participation from students and faculty members.",
    image: null,
    tradeCategory: "General",
    likes: 21,
    comments: 5,
    reposts: 2,
  },
  {
    id: 2,
    authorId: 102,
    author: "John's Carpentry Services",
    authorAvatar: null,
    headline: "Professional Carpenter - 15 Years Experience",
    timeAgo: "5h",
    description:
      "Looking for custom furniture or home renovations? We specialize in:\n• Custom cabinets and wardrobes\n• Wooden flooring installation\n• Door and window frames\n• Kitchen remodeling\n• Deck and pergola construction\n\nQuality craftsmanship guaranteed! Contact us for a free quote.",
    image: null,
    tradeCategory: "Carpenter",
    likes: 42,
    comments: 8,
    reposts: 5,
  },
  {
    id: 3,
    authorId: 103,
    author: "QuickFix Plumbing",
    authorAvatar: null,
    headline: "Licensed Plumber - Emergency Services Available",
    timeAgo: "8h",
    description:
      "Need plumbing services? We're here to help!\n\n✓ Leak repairs\n✓ Pipe installation & replacement\n✓ Water heater services\n✓ Drain cleaning\n✓ Bathroom & kitchen plumbing\n\n24/7 emergency service available. Book now!",
    image: null,
    tradeCategory: "Plumber",
    likes: 89,
    comments: 12,
    reposts: 4,
  },
  {
    id: 4,
    authorId: 104,
    author: "Bright Spark Electrical",
    authorAvatar: null,
    headline: "Certified Electrician - Residential & Commercial",
    timeAgo: "12h",
    description:
      "Professional electrical services for your home or business:\n\n⚡ Wiring and rewiring\n⚡ Panel upgrades\n⚡ Lighting installation\n⚡ Outlet and switch repair\n⚡ Safety inspections\n\nLicensed, insured, and ready to serve!",
    image: null,
    tradeCategory: "Electrician",
    likes: 67,
    comments: 15,
    reposts: 3,
  },
  {
    id: 5,
    authorId: 105,
    author: "ColorPro Painting",
    authorAvatar: null,
    headline: "Professional Painting Services",
    timeAgo: "1d",
    description:
      "Transform your space with our expert painting services!\n\n🎨 Interior & exterior painting\n🎨 Wallpaper installation\n🎨 Texture coating\n🎨 Color consultation\n\nFree estimates available. Let's bring your vision to life!",
    image: null,
    tradeCategory: "Painter",
    likes: 56,
    comments: 9,
    reposts: 2,
  },
  {
    id: 6,
    authorId: 106,
    author: "Tech Innovations Inc",
    authorAvatar: null,
    headline: "Technology & Innovation",
    timeAgo: "1d",
    description:
      "We're excited to announce our new AI-powered analytics platform! This cutting-edge solution will help businesses make data-driven decisions faster than ever before.",
    image: null,
    tradeCategory: "General",
    likes: 142,
    comments: 28,
    reposts: 15,
  },
  {
    id: 7,
    authorId: 107,
    author: "Sarah Mitchell",
    authorAvatar: null,
    headline: "Software Engineer at Google",
    timeAgo: "2d",
    description:
      "Just completed a machine learning project that improved our recommendation system by 40%! Excited to share what I learned at the upcoming tech conference. #MachineLearning #AI #TechTalk",
    image: null,
    tradeCategory: "General",
    likes: 234,
    comments: 45,
    reposts: 18,
  },
  {
    id: 8,
    authorId: 108,
    author: "Michael Chen",
    authorAvatar: null,
    headline: "Product Manager | Startup Enthusiast",
    timeAgo: "2d",
    description:
      "5 lessons I learned building products from 0 to 1:\n\n1. Talk to users early and often\n2. Ship fast, iterate faster\n3. Data > opinions\n4. Simplicity wins\n5. Team culture matters\n\nWhat would you add to this list?",
    image: null,
    tradeCategory: "General",
    likes: 178,
    comments: 62,
    reposts: 24,
  },
  {
    id: 9,
    authorId: 109,
    author: "Priya Sharma",
    authorAvatar: null,
    headline: "UX Designer | Creating delightful experiences",
    timeAgo: "3d",
    description:
      "Design is not just what it looks like and feels like. Design is how it works. - Steve Jobs\n\nJust wrapped up a redesign project that increased user engagement by 65%. Here's what made the difference: user research, iterative testing, and a focus on accessibility. #UXDesign #UserExperience",
    image: null,
    tradeCategory: "General",
    likes: 156,
    comments: 38,
    reposts: 12,
  },
  {
    id: 10,
    authorId: 110,
    author: "David Rodriguez",
    authorAvatar: null,
    headline: "Full Stack Developer | Open Source Contributor",
    timeAgo: "3d",
    description:
      "Just published a new open source library for React state management! It's lightweight, type-safe, and easy to use. Check it out on GitHub and let me know what you think. Contributions welcome! 🚀 #OpenSource #React #WebDev",
    image: null,
    tradeCategory: "General",
    likes: 289,
    comments: 71,
    reposts: 34,
  },
  {
    id: 11,
    authorId: 111,
    author: "Emily Thompson",
    authorAvatar: null,
    headline: "Data Scientist | AI Researcher",
    timeAgo: "4d",
    description:
      "Fascinating results from our latest research on neural network optimization! We achieved 30% faster training times while maintaining accuracy. Paper will be published next month. Excited to share more details soon! #DataScience #AI #Research",
    image: null,
    tradeCategory: "General",
    likes: 198,
    comments: 42,
    reposts: 16,
  },
  {
    id: 12,
    authorId: 112,
    author: "James Anderson",
    authorAvatar: null,
    headline: "DevOps Engineer | Cloud Architecture",
    timeAgo: "4d",
    description:
      "Successfully migrated our entire infrastructure to Kubernetes! Here are the key benefits we're seeing:\n\n✅ 99.99% uptime\n✅ 40% cost reduction\n✅ Faster deployments\n✅ Better resource utilization\n\nHappy to share our journey if anyone is interested! #DevOps #Kubernetes #CloudNative",
    image: null,
    tradeCategory: "General",
    likes: 167,
    comments: 54,
    reposts: 21,
  },
  {
    id: 13,
    authorId: 113,
    author: "Raj Patel",
    authorAvatar: null,
    headline: "Mobile App Developer | iOS & Android",
    timeAgo: "5d",
    description:
      "Our app just hit 1 million downloads! 🎉 Thank you to our amazing community for the support. Here's to building even better features in 2025! #MobileApp #iOS #Android #Milestone",
    image: null,
    tradeCategory: "General",
    likes: 421,
    comments: 89,
    reposts: 45,
  },
  {
    id: 14,
    authorId: 114,
    author: "Lisa Wang",
    authorAvatar: null,
    headline: "Cybersecurity Specialist | Ethical Hacker",
    timeAgo: "5d",
    description:
      "Reminder: Enable 2FA on all your accounts! Just prevented a major security breach thanks to proper authentication protocols. Stay safe out there! 🔒 #Cybersecurity #InfoSec #Security",
    image: null,
    tradeCategory: "General",
    likes: 312,
    comments: 67,
    reposts: 78,
  },
  {
    id: 15,
    authorId: 115,
    author: "Tom Wilson",
    authorAvatar: null,
    headline: "Blockchain Developer | Web3 Enthusiast",
    timeAgo: "6d",
    description:
      "Deployed my first smart contract on Ethereum mainnet today! The future of decentralized applications is here. Working on a DeFi platform that will revolutionize lending. More updates coming soon! #Blockchain #Web3 #Ethereum",
    image: null,
    tradeCategory: "General",
    likes: 245,
    comments: 58,
    reposts: 29,
  },
];

const PostList = () => {
  const [sortBy, setSortBy] = useState<"time" | "likes">("time");
  const [posts, setPosts] = useState<any[]>([]);

  // Get current user ID
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || JSON.stringify({ id: Date.now() }));

  // Filter and sort posts
  const filterAndSortPosts = () => {
    // Combine static posts with user's posts from localStorage
    const myPosts = JSON.parse(localStorage.getItem("myPosts") || "[]");
    const allPosts = [...staticPosts, ...myPosts];

    // Filter out current user's posts
    const filteredPosts = allPosts.filter(post => post.authorId !== currentUser.id);

    // Sort based on selected option
    if (sortBy === "likes") {
      return [...filteredPosts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      // Sort by time (newest first) - for now using id as proxy for time
      return [...filteredPosts].sort((a, b) => b.id - a.id);
    }
  };

  useEffect(() => {
    setPosts(filterAndSortPosts());
  }, [sortBy]);

  // Listen for post updates
  useEffect(() => {
    const handlePostsUpdated = () => {
      setPosts(filterAndSortPosts());
    };

    window.addEventListener("postsUpdated", handlePostsUpdated);
    return () => window.removeEventListener("postsUpdated", handlePostsUpdated);
  }, [sortBy]);

  // If there are no posts at all, show the end message
  if (posts.length === 0) {
    return <ViewPost isEnd />;
  }

  return (
    <>
      <div className="post-list-header">
        <div className="sort-dropdown">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "time" | "likes")}
            className="sort-select"
          >
            <option value="time">Most Recent</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </div>
      {posts.map((post) => (
        <ViewPost key={post.id} post={post} />
      ))}
      <ViewPost isEnd />
    </>
  );
};

export default PostList;
