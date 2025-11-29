export const HBS_TEMPLATES: Record<string, string> = {
  t1: `
  <section style="background: {{themeColor}}; color: #fff; padding: 80px 24px; text-align:center">
    <h1 style="font-size:48px; margin:0 0 8px">{{fullName}}</h1>
    <p style="opacity:0.9; text-transform:uppercase">{{title}}</p>
  </section>
  <section style="max-width:960px; margin: 40px auto; padding: 0 24px;">
    <h3 style="text-transform:uppercase; letter-spacing:2px; color:#888; text-align:center">About</h3>
    <p style="color:#222; line-height:1.8; text-align:center">{{bio}}</p>
  </section>
  <section style="background:#f8f9fb; padding: 40px 24px;">
    <div style="max-width:1100px; margin:0 auto">
      <h2 style="text-align:center; font-weight:700; margin-bottom:24px">Selected Works</h2>
      {{#each projects}}
      <div style="background:#fff; border:1px solid #eee; border-radius:16px; overflow:hidden; margin-bottom:24px">
        <div style="aspect-ratio:16/9; background:#eee"></div>
        <div style="padding:24px">
          <h3 style="margin-bottom:8px">{{title}}</h3>
          <p style="color:#666; margin-bottom:12px">{{description}}</p>
          <div style="display:flex; gap:8px; flex-wrap:wrap">
            {{#each (split technologies ',')}}
              <span style="border:1px solid #ddd; padding:4px 8px; font-size:12px; text-transform:uppercase">{{this}}</span>
            {{/each}}
          </div>
        </div>
      </div>
      {{/each}}
    </div>
  </section>
  `,
  t2: `
  <section style="background: {{themeColor}}; color:#fff; padding: 60px 24px; text-align:center">
    <h1 style="font-size:42px; margin:0 0 8px">{{fullName}}</h1>
    <p style="opacity:0.9">{{title}}</p>
  </section>
  <section style="max-width:960px; margin: 32px auto; padding: 0 24px;">
    <h3 style="text-transform:uppercase; letter-spacing:2px; color:#888;">Bio</h3>
    <p style="color:#222; line-height:1.8;">{{bio}}</p>
  </section>
  <section style="max-width:960px; margin: 24px auto; padding: 0 24px;">
    <h3 style="text-transform:uppercase; letter-spacing:2px; color:#888;">Skills</h3>
    <div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px;">
      {{#each skills}}
        <div style="background:#fff; border:1px solid #eee; border-radius:12px; padding:12px">
          <strong>{{name}}</strong>
          <div style="font-size:12px; color:#666; text-transform:uppercase">{{level}}</div>
        </div>
      {{/each}}
    </div>
  </section>
  <section style="background:#f8f9fb; padding: 24px">
    <div style="max-width:1100px; margin:0 auto">
      <h3 style="text-transform:uppercase; letter-spacing:2px; color:#888;">Projects</h3>
      {{#each projects}}
        <div style="background:#fff; border:1px solid #eee; border-radius:16px; margin-bottom:16px; padding:16px">
          <strong>{{title}}</strong>
          <p style="color:#666">{{description}}</p>
          <small style="color:#999">{{technologies}}</small>
        </div>
      {{/each}}
    </div>
  </section>
  `,
  t3: `
  <section style="padding:40px 24px; text-align:center">
    <h1 style="font-size:40px; margin:0 0 8px">{{fullName}}</h1>
    <p style="opacity:0.8">{{title}}</p>
  </section>
  <section style="max-width:960px; margin: 24px auto; padding: 0 24px;">
    <h3 style="text-transform:uppercase; letter-spacing:2px; color:#888;">Executive Summary</h3>
    <p style="color:#222; line-height:1.8;">{{bio}}</p>
  </section>
  <section style="max-width:960px; margin: 24px auto; padding: 0 24px;">
    <h3 style="text-transform:uppercase; letter-spacing:2px; color:#888;">Engagements</h3>
    {{#each projects}}
      <div style="border-left:4px solid {{../themeColor}}; padding-left:12px; margin-bottom:16px">
        <strong>{{title}}</strong>
        <p style="color:#666">{{description}}</p>
        <small style="color:#999">{{technologies}}</small>
      </div>
    {{/each}}
  </section>
  `,
  t4: `
  <section style="padding:40px 24px; text-align:center; background: {{themeColor}}10">
    <h1 style="font-size:40px; margin:0 0 8px">{{fullName}}</h1>
    <p style="opacity:0.8">{{title}}</p>
  </section>
  <section style="max-width:1120px; margin: 24px auto; padding: 0 24px;">
    <h3 style="text-transform:uppercase; letter-spacing:2px; color:#888;">Artist Bio</h3>
    <p style="color:#222; line-height:1.8;">{{bio}}</p>
  </section>
  <section style="max-width:1120px; margin: 24px auto; padding: 0 24px;">
    <h3 style="text-transform:uppercase; letter-spacing:2px; color:#888;">Works</h3>
    <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px;">
    {{#each projects}}
      <div style="background:#fff; border:1px solid #eee; border-radius:16px; padding:16px">
        <strong>{{title}}</strong>
        <p style="color:#666">{{description}}</p>
        <small style="color:#999">{{technologies}}</small>
      </div>
    {{/each}}
    </div>
  </section>
  `
};

// Simple helper to split strings by comma
import Handlebars from 'handlebars';
Handlebars.registerHelper('split', function(str: string, sep: string) {
  if (!str) return [];
  return String(str).split(sep).map(s => s.trim()).filter(Boolean);
});
