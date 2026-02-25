'use client';

import styles from './homepage.module.css';

interface HomePageProps {
    onLaunchApp: () => void;
}

export function HomePage({ onLaunchApp }: HomePageProps) {
    return (
        <div className={styles.homePage}>
            {/* Site Logo */}
            <a href="/" className={styles.siteLogo}>
                <img src="/homepage/logo.png" alt="BeekTools Logo" />
            </a>

            {/* Animated Background */}
            <div className={styles.backgroundElements}>
                <div className={styles.honeycombPattern}></div>
                <div className={`${styles.bee} ${styles.bee1}`}>🐝</div>
                <div className={`${styles.bee} ${styles.bee2}`}>🐝</div>
                <div className={`${styles.bee} ${styles.bee3}`}>🐝</div>
            </div>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <div className={styles.badgeContainer}>
                            <span className={`${styles.badge} ${styles.badgeFree}`}>100% FREE</span>
                        </div>
                        <h1 className={styles.heroTitle}>
                            Beekeeping Tools for<br />
                            <span className={styles.highlight}>Beekeeping Enthusiasts</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Hive management made simple. Track your Top Bar and Langstroth hives, and plan inspections with confidence.
                        </p>
                        <p className={styles.heroTagline}>
                            <strong>Free forever.</strong> Built for hobby beekeepers who love the hands-on approach.
                        </p>
                        <button onClick={onLaunchApp} className={styles.ctaButton}>
                            Launch the App 🐝
                        </button>
                    </div>
                </div>
            </section>

            {/* App Showcase */}
            <section id="apps" className={styles.appsShowcase}>
                <div className={styles.container}>
                    <div className={styles.appsGrid}>
                        {/* Beekeeper Card */}
                        <div className={styles.appCard}>
                            <div className={`${styles.appScreenshot} ${styles.splitView}`}>
                                <span className={styles.screenshotBadge}>FREE</span>
                                <div className={styles.splitHeader}>Multiple Hive Types</div>
                                <div className={styles.splitContainer}>
                                    <div className={styles.splitCol}>
                                        <span className={styles.splitLabel}>Langstroth Hive</span>
                                        <img src="/homepage/screenshot-langstroth.png" alt="Langstroth Hive Configuration" />
                                    </div>
                                    <div className={styles.splitCol}>
                                        <span className={styles.splitLabel}>Top Bar Hive</span>
                                        <img src="/homepage/screenshot-tbh.png" alt="Top Bar Hive Configuration" />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.appContent}>
                                <h2 className={styles.appTitle}>Beekeeper</h2>
                                <p className={styles.appDescription}>Your digital companion for hive management</p>
                                <ul className={styles.appFeatures}>
                                    <li><span className={styles.featureIcon}>📊</span><span>Manage Top Bar and Langstroth hives visually</span></li>
                                    <li><span className={styles.featureIcon}>🍯</span><span>Track brood, resources, and hive components</span></li>
                                    <li><span className={styles.featureIcon}>📸</span><span>Snapshot history to monitor colony progress</span></li>
                                    <li><span className={styles.featureIcon}>🌿</span><span>Perfect for natural, treatment-free beekeeping</span></li>
                                </ul>
                                <button onClick={onLaunchApp} className={styles.appButton}>
                                    Launch App - Just Email Required →
                                </button>
                            </div>
                        </div>

                        {/* Hive Forecast Card */}
                        <div className={styles.appCard}>
                            <div className={styles.appScreenshot}>
                                <span className={styles.screenshotBadge}>FREE</span>
                                <img src="/homepage/hive-forecast-screenshot.png" alt="Hive Forecast App showing weather scoring grid" />
                            </div>
                            <div className={styles.appContent}>
                                <h2 className={styles.appTitle}>Hive Forecast</h2>
                                <p className={styles.appDescription}>Know the perfect time to inspect your hives</p>
                                <ul className={styles.appFeatures}>
                                    <li><span className={styles.featureIcon}>🌡️</span><span>Weather scoring system (temperature, wind, conditions)</span></li>
                                    <li><span className={styles.featureIcon}>📅</span><span>7-day forecast with color-coded ratings</span></li>
                                    <li><span className={styles.featureIcon}>⏰</span><span>Plan inspections around your schedule</span></li>
                                    <li><span className={styles.featureIcon}>✨</span><span>Maximize hive health with optimal timing</span></li>
                                </ul>
                                <a href="https://forecast.beektools.com" className={styles.appButton} target="_blank" rel="noopener noreferrer">
                                    Launch App - Just Enter Any Zipcode →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className={styles.benefits}>
                <div className={styles.container}>
                    <h2 className={styles.benefitsTitle}>Why BeekTools for Your Hives?</h2>
                    <div className={styles.benefitsGrid}>
                        <div className={styles.benefitCard}>
                            <div className={styles.benefitIcon}>💰</div>
                            <h3>100% Free Forever</h3>
                            <p>No subscriptions, no hidden fees, no credit card required. Just great tools for beekeepers.</p>
                        </div>
                        <div className={styles.benefitCard}>
                            <div className={styles.benefitIcon}>🧪</div>
                            <h3>Share Your Experience</h3>
                            <p>Help shape the future! Your feedback makes these tools better for everyone.</p>
                        </div>
                        <div className={styles.benefitCard}>
                            <div className={styles.benefitIcon}>📊</div>
                            <h3>Track with Ease</h3>
                            <p>Visual hive configurations make it simple to monitor your colony&apos;s progress</p>
                        </div>
                        <div className={styles.benefitCard}>
                            <div className={styles.benefitIcon}>🌤️</div>
                            <h3>Plan Around Weather</h3>
                            <p>Smart weather scoring helps you choose the best inspection times</p>
                        </div>
                    </div>

                    <div className={styles.workflow}>
                        <div className={styles.workflowStep}>
                            <div className={styles.workflowNumber}>1</div>
                            <p>Manage</p>
                        </div>
                        <div className={styles.workflowArrow}>→</div>
                        <div className={styles.workflowStep}>
                            <div className={styles.workflowNumber}>2</div>
                            <p>Plan</p>
                        </div>
                        <div className={styles.workflowArrow}>→</div>
                        <div className={styles.workflowStep}>
                            <div className={styles.workflowNumber}>3</div>
                            <p>Inspect</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community CTA */}
            <section className={styles.betaCta}>
                <div className={styles.container}>
                    <div className={styles.betaContent}>
                        <h2>🐝 Join Our BeekTools Community</h2>
                        <p>Help us build better tools for beekeepers! We love hearing from hobby beekeepers—your feedback helps shape the future of BeekTools.</p>
                        <div className={styles.betaBenefits}>
                            <span>✓ Always adding new features</span>
                            <span>✓ Your input drives development</span>
                            <span>✓ Free forever (obviously!)</span>
                        </div>
                        <p className={styles.betaNote}>Simple email sign-up keeps your hive data secure and separate. Start using the apps and share your feedback!</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.container}>
                    <p>&copy; 2026 BeekTools. Free tools for hobby beekeepers, built with ❤️ for the beekeeping community.</p>
                </div>
            </footer>
        </div>
    );
}
