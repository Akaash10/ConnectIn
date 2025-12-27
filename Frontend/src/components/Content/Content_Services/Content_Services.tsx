import { useState, useEffect } from "react";
import "./Content_Services.css";
import ViewPost from "../ViewPost/ViewPost";

const Content_Services = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"time" | "likes">("time");
  const [posts, setPosts] = useState<any[]>([]);

  const tradeCategories = [
    "All",
    "Carpenter",
    "Plumber",
    "Electrician",
    "Painter",
    "Mason",
    "HVAC Technician",
    "Landscaper",
    "Cleaner",
    "Other Services"
  ];

  // Get all service posts (exclude General posts, only show trade-specific ones)
  const getAllServicePosts = () => {
    const myPosts = JSON.parse(localStorage.getItem("myPosts") || "[]");
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || JSON.stringify({ id: Date.now() }));

    // Static posts from PostList.tsx
    const staticPosts = [
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
    ];

    const allPosts = [...staticPosts, ...myPosts];

    // Filter for service posts only (exclude "General" category)
    const servicePosts = allPosts.filter(post =>
      post.tradeCategory && post.tradeCategory !== "General"
    );

    return servicePosts;
  };

  const filterAndSortPosts = () => {
    const allPosts = getAllServicePosts();

    // Filter by category
    let filtered = allPosts;
    if (selectedCategory !== "All") {
      filtered = allPosts.filter(post => post.tradeCategory === selectedCategory);
    }

    // Sort based on selected option
    if (sortBy === "likes") {
      return [...filtered].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      // Sort by time (newest first) - using id as proxy for time
      return [...filtered].sort((a, b) => b.id - a.id);
    }
  };

  useEffect(() => {
    setPosts(filterAndSortPosts());
  }, [selectedCategory, sortBy]);

  // Listen for post updates
  useEffect(() => {
    const handlePostsUpdated = () => {
      setPosts(filterAndSortPosts());
    };

    window.addEventListener("postsUpdated", handlePostsUpdated);
    return () => window.removeEventListener("postsUpdated", handlePostsUpdated);
  }, [selectedCategory, sortBy]);

  return (
    <div className="content-services">
      <div className="services-header">
        <h2>Service Providers</h2>
        <p>Find skilled professionals for your needs</p>
      </div>

      <div className="services-filter">
        <div className="filter-section">
          <div className="filter-label">Filter by category:</div>
          <div className="filter-buttons">
            {tradeCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="sort-section">
          <label htmlFor="services-sort-select" className="sort-label">Sort by:</label>
          <select
            id="services-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "time" | "likes")}
            className="sort-select"
          >
            <option value="time">Most Recent</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </div>

      <div className="services-posts">
        {posts.length === 0 ? (
          <div className="no-services">
            <div className="no-services-icon">🔍</div>
            <h3>No service providers found</h3>
            <p>Try selecting a different category or check back later.</p>
          </div>
        ) : (
          posts.map((post) => (
            <ViewPost key={post.id} post={post} showBookButton={true} />
          ))
        )}
      </div>
    </div>
  );
};

export default Content_Services;
