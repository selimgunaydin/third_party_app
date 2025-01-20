export interface DefaultComponent {
  id: string;
  name: string;
  description: string;
  type: string;
  properties: {
    [key: string]: string | number;
  };
  html: string;
  css: string;
}

export const defaultComponents: DefaultComponent[] = [
  {
    id: "button-1",
    name: "Modern Button",
    description: "A modern button with rounded corners",
    type: "button",
    properties: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "10px 20px",
    },
    html: "<button>Click</button>",
    css: "border-radius: 8px; border: none; cursor: pointer;"
  },
  {
    id: "input-1",
    name: "Search Box",
    description: "Modern search input field",
    type: "input",
    properties: {
      placeholder: "Search...",
      borderColor: "#ddd",
    },
    html: "<input type='text' placeholder='Search...' />",
    css: "padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
  },
  {
    id: "card-1",
    name: "Info Card",
    description: "Information card component with shadow",
    type: "card",
    properties: {
      backgroundColor: "white",
      padding: "20px",
    },
    html: `<div class="info-card">
  <h3>Title</h3>
  <p>Card content goes here</p>
</div>`,
    css: `.info-card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 8px;
  background: white;
  padding: 20px;
}
.info-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}
.info-card p {
  margin: 0;
  color: #666;
}`
  },
  {
    id: "notification-1",
    name: "Notification Banner",
    description: "Notification banner that appears at the top",
    type: "notification",
    properties: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
    },
    html: `<div class="notification">
  <span class="notification-text">Important notification message!</span>
  <button class="close-btn">&times;</button>
</div>`,
    css: `.notification {
  padding: 12px 20px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
}`
  },
  {
    id: "social-share-1",
    name: "Social Media Share",
    description: "Social media share buttons",
    type: "social",
    properties: {
      display: "flex",
      gap: "10px",
    },
    html: `<div class="social-share">
  <button class="share-btn facebook">Facebook</button>
  <button class="share-btn twitter">Twitter</button>
  <button class="share-btn linkedin">LinkedIn</button>
</div>`,
    css: `.social-share {
  display: flex;
  gap: 10px;
}
.share-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}
.facebook { background: #1877f2; }
.twitter { background: #1da1f2; }
.linkedin { background: #0a66c2; }`
  }
]; 