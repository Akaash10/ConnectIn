import { useState, useEffect, useRef } from "react";
import "./TopNav_Left.css";

interface User {
  id: number;
  name: string;
  headline: string;
  avatarUrl: string | null;
}

const TopNavLeft = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = () => {
    const event = new CustomEvent("navigate", { detail: "home" });
    window.dispatchEvent(event);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Search for users from posts and connections
    const myPosts = JSON.parse(localStorage.getItem("myPosts") || "[]");
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    // Extract unique users from posts
    const usersMap = new Map<number, User>();

    myPosts.forEach((post: any) => {
      if (post.authorId && post.authorId !== currentUser.id) {
        const userName = post.author.toLowerCase();
        const queryLower = query.toLowerCase();

        if (userName.includes(queryLower)) {
          usersMap.set(post.authorId, {
            id: post.authorId,
            name: post.author,
            headline: post.headline || "Professional",
            avatarUrl: post.authorAvatar || null,
          });
        }
      }
    });

    const results = Array.from(usersMap.values()).slice(0, 5); // Limit to 5 results
    setSearchResults(results);
    setShowResults(results.length > 0);
  };

  const handleUserClick = (userId: number) => {
    const event = new CustomEvent("viewProfile", { detail: userId });
    window.dispatchEvent(event);
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="topnav-left">
      <div className="logo" onClick={handleLogoClick}>Cin</div>
      <div className="search-box" ref={searchRef}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowResults(true);
            }
          }}
        />
        {showResults && searchResults.length > 0 && (
          <div className="search-results-dropdown">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="search-result-item"
                onClick={() => handleUserClick(user.id)}
              >
                <div className="search-result-avatar">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <div className="search-result-info">
                  <div className="search-result-name">{user.name}</div>
                  <div className="search-result-headline">{user.headline}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNavLeft;
