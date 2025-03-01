import React, { useRef, useEffect } from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Layout } from '@components';
import styled from 'styled-components';
import { theme, mixins, media, Main } from '@styles';
const { colors, fonts, fontSizes } = theme;

const StyledMainContainer = styled(Main)`
  min-height: 100vh;
  height: 100%;
  max-width: 1600px;
`;
const StyledTitleContainer = styled.header`
  margin-top: 200px;
  ${media.tablet`
    margin-top: 150px;
  `};
`;
const StyledTitle = styled.h1`
  font-size: 80px;
  line-height: 1.1;
  margin: 0;
  ${media.desktop`font-size: 70px;`};
  ${media.tablet`font-size: 60px;`};
  ${media.phablet`font-size: 50px;`};
  ${media.phone`font-size: 40px;`};
`;
const StyledSubtitle = styled.p`
  color: ${colors.green};
  margin: 0 0 20px 3px;
  font-size: ${fontSizes.md};
  font-family: ${fonts.SFMono};
  font-weight: normal;
  ${media.desktop`font-size: ${fontSizes.sm};`};
  ${media.tablet`font-size: ${fontSizes.smish};`};
`;
const StyledTableContainer = styled.div`
  margin: 100px -20px;
  ${media.tablet`
    margin: 100px -10px;
  `};
`;
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  .hide-on-mobile {
    ${media.tablet`
      display: none;
    `};
  }

  tbody tr {
    transition: ${theme.transition};

    &:hover,
    &:focus {
      background-color: ${colors.lightNavy};
    }
  }
  th,
  td {
    cursor: default;
    line-height: 1.5;
    padding: 10px 20px;
    ${media.tablet`
      padding: 10px;
    `};
  }
  th {
    text-align: left;
  }
  td {
    &.year {
      width: 10%;
      ${media.tablet`
        font-size: ${fontSizes.sm};
      `};
    }
    &.title {
      padding-top: 15px;
      color: ${colors.lightestSlate};
      font-size: ${fontSizes.xl};
      font-weight: 700;
      width: 35%;
    }
    &.company {
      width: 15%;
      padding-top: 15px;
      font-size: ${fontSizes.lg};
    }
    &.tech {
      font-size: ${fontSizes.xs};
      font-family: ${fonts.SFMono};
    }
    &.links {
      width: 10%;
      span {
        ${mixins.flexBetween};
        a {
          margin-left: 10px;
        }
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
`;

const ArchivePage = ({ location, data }) => {
  const research = data.research.edges;

  const revealTitle = useRef(null);
  const revealTable = useRef(null);
  const revealResearch = useRef([]);
  useEffect(() => {
    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealTable.current, srConfig());
    revealResearch.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 10)));
  }, []);

  return (
    <Layout location={location}>
      <Helmet>
        <title>Archive | Brittany Chiang</title>
        <link rel="canonical" href="https://brittanychiang.com/archive" />
      </Helmet>

      <StyledMainContainer>
        <StyledTitleContainer ref={revealTitle}>
          <StyledTitle>Archive</StyledTitle>
          <StyledSubtitle>A big list of things I’ve worked on</StyledSubtitle>
        </StyledTitleContainer>

        <StyledTableContainer ref={revealTable}>
          <StyledTable>
            <thead>
              <tr>
                <th>Year</th>
                <th>Title</th>
                <th className="hide-on-mobile">Made for</th>
                <th className="hide-on-mobile">Tags</th>
              </tr>
            </thead>
            <tbody>
              {research.length > 0 &&
                research.map(({ node }, i) => {
                  const { date, github, title, tech, company } = node.frontmatter;
                  return (
                    <tr key={i} ref={el => (revealResearch.current[i] = el)}>
                      <td className="overline year">{`${new Date(date).getFullYear()}`}</td>

                      <td className="title">
                        <a
                          href={github}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          aria-label="GitHub Link">
                          {title}
                        </a>
                      </td>

                      <td className="company hide-on-mobile">
                        {company ? <span>{company}</span> : <span>—</span>}
                      </td>

                      <td className="tech hide-on-mobile">
                        {tech.length > 0 &&
                          tech.map((item, i) => (
                            <span key={i}>
                              <span key={i}>{item}</span>
                              {i !== tech.length - 1 && <span>&nbsp;&middot;&nbsp;</span>}
                            </span>
                          ))}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </StyledTable>
        </StyledTableContainer>
      </StyledMainContainer>
    </Layout>
  );
};
ArchivePage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default ArchivePage;

export const pageQuery = graphql`
  {
    research: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/research/" } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            date
            title
            tech
            github
            external
            company
            show
          }
          html
        }
      }
    }
  }
`;
