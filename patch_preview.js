const fs = require('fs');
let code = fs.readFileSync('src/components/ResumePreview.tsx', 'utf-8');

// The goal is to make certifications and workshops compact, and add workshops.

// 1. Add workshops section right after certifications. We can do this by regex replacing the end of certifications block.
// But certifications blocks differ slightly per template. Let's just find `</section>` or `</div>` after certifications.
