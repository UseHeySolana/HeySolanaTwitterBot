import { BASE_URL } from "..";

const request = {
  get: async (url: string) => {
    const response = await fetch(BASE_URL + url, {
      method: "GET",
    });

    return response;
  },
  post: async (data: FormData, url: string) => {
    // Upload to your API endpoint

    const response = await fetch(BASE_URL + url, {
      method: "POST",
      body: data,
    });

    return response;
  },
};

const fetchUser = async (userId: string) => {
  try {
    const response = await request.get(`/fetch_user/${userId}`);
    // const docRef = doc(db, "message", userId);
    if (response) {
      const data = await response.json();
      return data;
    } else {
      console.log("No Such User!");
      return false;
    }
  } catch (e) {
    console.error("Error fetching Data", e);
    return false;
  }
};

const addTweet = async (
  tweetId: string,
  userId: string,
  tweet: string
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append("tweet_id", tweetId);
    formData.append("tweet", tweet);
    formData.append("user_id", userId);

    const response = await request.post(formData, "/add_tweet");
    const data = await response.json();
    return true;
  } catch (error) {
    console.log("Error adding document ", error);
    return false;
  }
};

const markResponse = async (tweetId: string) => {
  try {
    const response = await request.get(`/mark_response/${tweetId}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
};

const saveCookie = async (cookie: string) => {
  try {
    const formData = new FormData();
    formData.append("cookie", cookie);
    const response = await request.post(formData, "/add_cookie");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error adding document ", error);
    return false;
  }
};

const fetchCookie = async () => {
  try {
    const response = await request.get(`/fetch_cookie`);
    const data = await response.json();
    return data.cookie;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return false;
  }
};

const fetchTweets = async () => {
  try {
    const response = await request.get(`/fetch_tweets`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return false;
  }
};
export {
  addTweet,
  markResponse,
  fetchUser,
  saveCookie,
  fetchCookie,
  fetchTweets,
};
