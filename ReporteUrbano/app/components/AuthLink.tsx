import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

interface AuthLinkProps {
  text: string;
  linkText: string;
  href: '../login' | '../register' | '../home';
}

const AuthLink = ({ text, linkText, href }: AuthLinkProps) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.text}>
        {text}{' '}
        <Link href={href} asChild>
          <Text style={styles.link}>{linkText}</Text>
        </Link>
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  link: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default AuthLink; 