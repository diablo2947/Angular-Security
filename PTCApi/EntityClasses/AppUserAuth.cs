namespace PTCApi.EntityClasses
{
    public class AppUserAuth : UserAuthBase
    {
        public AppUserAuth() : base()
        {
            CanAccessCategories = false;
            CanAccessLogs = false;
            CanAccessProducts = false;
            CanAccessSettings = false;
            CanAddProduct = false;
            CanAddCategory = false;
            CanSaveProduct = false;
            CanEditProduct = false;
            CanDeleteProduct = false;
        }
        public bool CanAccessProducts { get; set; }
        public bool CanAccessCategories { get; set; }
        public bool CanAccessLogs { get; set; }
        public bool CanAccessSettings { get; set; }
        public bool CanAddProduct { get; set; }
        public bool CanAddCategory { get; set; }
        public bool CanSaveProduct { get; set; }
        public bool CanEditProduct { get; set; }
        public bool CanDeleteProduct { get; set; }
    }
}