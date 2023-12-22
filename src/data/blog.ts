import { Parser } from "xml2js";

type RSSBlog = {
  rss: {
    channel: {
      item: {
        title: string;
        link: string;
        pubDate: string;
      }[];
    };
  };
};

type Blog = {
  title: string;
  link: string;
  date: string;
};

const getBlogPosts = async (): Promise<Blog[]> => {
  try {
    // Fetches data from your blog via RSS
    const blogFeed = await fetch("https://blog.jamiin.com/rss.xml");

    if (!blogFeed.ok) {
      throw new Error(
        `Failed to fetch blog posts (${blogFeed.status} ${blogFeed.statusText})`
      );
    }

    const blogData = await blogFeed.text();

    // parse the XML data
    const parser = new Parser({ explicitArray: false });
    const parsedData: RSSBlog = await parser.parseStringPromise(blogData);

    const blogPosts: Blog[] = parsedData.rss.channel.item.map((item) => ({
      title: item.title,
      link: item.link,
      date: item.pubDate,
    }));

    return blogPosts;
  } catch (error: any) {
    console.error("Error fetching blog posts:", error.message);
    return []; // Return an empty array in case of an error
  }
};

export default getBlogPosts;
