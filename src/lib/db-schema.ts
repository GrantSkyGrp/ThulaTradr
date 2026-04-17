export const localSchemaOverview = {
  tables: [
    {
      name: "users",
      purpose: "Local authentication and role identity for the rewrite",
      columns: ["id", "name", "email", "password", "role"],
    },
    {
      name: "offers",
      purpose: "Persisted buyer offers linked to listings and users",
      columns: [
        "id",
        "listing_slug",
        "listing_model",
        "user_id",
        "user_name",
        "user_email",
        "amount",
        "current_list_price",
        "payable_now",
        "status",
        "created_at",
      ],
    },
  ],
} as const;
