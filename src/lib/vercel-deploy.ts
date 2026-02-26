import { slugify } from "./utils";

export async function deploySite(
  siteId: string,
  html: string,
  businessName: string
): Promise<string> {
  const token = process.env.VERCEL_TOKEN;

  if (!token) {
    return `https://${slugify(businessName)}.vercel.app (deployment pending — Vercel token not configured)`;
  }

  const slug = slugify(businessName);

  // Create a new project
  const projectRes = await fetch("https://api.vercel.com/v10/projects", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: slug,
      framework: null,
    }),
  });

  if (!projectRes.ok) {
    const err = await projectRes.json();
    // Project might already exist — that's fine
    if (err.error?.code !== "project_already_exists") {
      throw new Error(`Failed to create project: ${err.error?.message || "Unknown error"}`);
    }
  }

  // Deploy the HTML file
  const deployRes = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: slug,
      target: "production",
      files: [
        {
          file: "index.html",
          data: Buffer.from(html).toString("base64"),
          encoding: "base64",
        },
      ],
      projectSettings: {
        framework: null,
      },
    }),
  });

  if (!deployRes.ok) {
    const err = await deployRes.json();
    throw new Error(`Deployment failed: ${err.error?.message || "Unknown error"}`);
  }

  const deployment = await deployRes.json();
  return `https://${deployment.url}`;
}
