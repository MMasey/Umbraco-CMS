using System.IO;
using Microsoft.Extensions.Options;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Configuration.Models;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Hosting;
using Umbraco.Extensions;

namespace Umbraco.ModelsBuilder.Embedded
{
    /// <summary>
    /// Used to track if ModelsBuilder models are out of date/stale
    /// </summary>
    public sealed class OutOfDateModelsStatus : INotificationHandler<UmbracoApplicationStarting>
    {
        private readonly ModelsBuilderSettings _config;
        private readonly IHostingEnvironment _hostingEnvironment;

        /// <summary>
        /// Initializes a new instance of the <see cref="OutOfDateModelsStatus"/> class.
        /// </summary>
        public OutOfDateModelsStatus(IOptions<ModelsBuilderSettings> config, IHostingEnvironment hostingEnvironment)
        {
            _config = config.Value;
            _hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// Gets a value indicating whether flagging out of date models is enabled
        /// </summary>
        public bool IsEnabled => _config.FlagOutOfDateModels;

        /// <summary>
        /// Gets a value indicating whether models are out of date
        /// </summary>
        public bool IsOutOfDate
        {
            get
            {
                if (_config.FlagOutOfDateModels == false)
                {
                    return false;
                }

                var path = GetFlagPath();
                return path != null && File.Exists(path);
            }
        }

        /// <summary>
        /// Handles the <see cref="UmbracoApplicationStarting"/> notification
        /// </summary>
        public void Handle(UmbracoApplicationStarting notification) => Install();

        private void Install()
        {
            // don't run if not configured
            if (!IsEnabled)
            {
                return;
            }

            ContentTypeCacheRefresher.CacheUpdated += (sender, args) => Write();
            DataTypeCacheRefresher.CacheUpdated += (sender, args) => Write();
        }

        private string GetFlagPath()
        {
            var modelsDirectory = _config.ModelsDirectoryAbsolute(_hostingEnvironment);
            if (!Directory.Exists(modelsDirectory))
            {
                Directory.CreateDirectory(modelsDirectory);
            }

            return Path.Combine(modelsDirectory, "ood.flag");
        }

        private void Write()
        {
            var path = GetFlagPath();
            if (path == null || File.Exists(path))
            {
                return;
            }

            File.WriteAllText(path, "THIS FILE INDICATES THAT MODELS ARE OUT-OF-DATE\n\n");
        }

        public void Clear()
        {
            if (_config.FlagOutOfDateModels == false)
            {
                return;
            }

            var path = GetFlagPath();
            if (path == null || !File.Exists(path))
            {
                return;
            }

            File.Delete(path);
        }
    }
}
